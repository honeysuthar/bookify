import { GoogleBooksResponse, GoogleBookVolume } from "@/types/google-books";

const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1";

// --- API key handling -------------------------------------------------
// Trim whitespace/newlines and strip accidental wrapping quotes — these
// are the most common reasons a key that "looks fine" in .env.local still
// fails a strict equality/emptiness check.
function resolveApiKey(): string {
  let key = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY ?? process.env.GOOGLE_BOOKS_API_KEY ?? "";
  key = key.trim().replace(/^['"]|['"]$/g, "");
  return key;
}

let warnedMissingKey = false;

const getApiKey = () => {
  const key = resolveApiKey();
  if (!key || key === "your_api_key_here") {
    // Only warn once per server process instead of on every single request —
    // the repeated warning in dev is what was flooding your console.
    if (!warnedMissingKey) {
      console.warn(
        "[google-books] GOOGLE_BOOKS_API_KEY is missing or invalid.\n" +
        "  1. Confirm the var lives in apps/web/.env.local (NOT the monorepo root).\n" +
        "  2. Restart `next dev` after editing .env.local — it's only read at boot.\n" +
        "  3. Make sure the value has no surrounding quotes or trailing spaces.\n" +
        "  Falling back to unauthenticated requests (very low rate limit) / mock data."
      );
      warnedMissingKey = true;
    }
    return "";
  }
  return `&key=${key}`;
};

// --- Simple in-memory response cache -----------------------------------
// Google Books has a low anonymous quota and a modest per-key quota; in dev,
// Fast Refresh + multiple rows on Dashboard/Discover requesting overlapping
// categories can trigger 429s even with a valid key. A short TTL cache
// collapses duplicate requests without needing Redis for local dev.
const CACHE_TTL_MS = 60_000;
const responseCache = new Map<string, { data: GoogleBooksResponse; expires: number }>();

function getCached(key: string): GoogleBooksResponse | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key: string, data: GoogleBooksResponse) {
  responseCache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
}

// --- Fetch with retry/backoff on 429/5xx --------------------------------
async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 429 || response.status >= 500) {
        const delay = 300 * Math.pow(2, i); // 300ms, 600ms, 1200ms
        if (i < attempts - 1) {
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
      }
      return response;
    } catch (err) {
      lastError = err;
      const delay = 300 * Math.pow(2, i);
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
    }
  }
  throw lastError ?? new Error("fetchWithRetry: exhausted attempts");
}

const MOCK_BOOKS_POOL = [
  {
    id: "mock-1",
    etag: "mock-1",
    selfLink: "",
    volumeInfo: {
      title: "Dune",
      authors: ["Frank Herbert"],
      imageLinks: { thumbnail: "https://books.google.com/books/publisher/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71L7FqXh0G4h5H13p4-Z11cT" }
    }
  },
  {
    id: "mock-2",
    etag: "mock-2",
    selfLink: "",
    volumeInfo: {
      title: "Neuromancer",
      authors: ["William Gibson"],
      imageLinks: { thumbnail: "https://books.google.com/books/content?id=s68rCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" }
    }
  },
  {
    id: "mock-3",
    etag: "mock-3",
    selfLink: "",
    volumeInfo: {
      title: "Foundation",
      authors: ["Isaac Asimov"],
      imageLinks: { thumbnail: "https://books.google.com/books/content?id=Y2uPQQMACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" }
    }
  },
  {
    id: "mock-4",
    etag: "mock-4",
    selfLink: "",
    volumeInfo: {
      title: "1984",
      authors: ["George Orwell"],
      imageLinks: { thumbnail: "https://books.google.com/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" }
    }
  },
  {
    id: "mock-5",
    etag: "mock-5",
    selfLink: "",
    volumeInfo: {
      title: "The Martian",
      authors: ["Andy Weir"],
      imageLinks: { thumbnail: "https://books.google.com/books/publisher/content?id=v-QfAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE7" }
    }
  },
  {
    id: "mock-6",
    etag: "mock-6",
    selfLink: "",
    volumeInfo: {
      title: "Project Hail Mary",
      authors: ["Andy Weir"],
      imageLinks: { thumbnail: "https://books.google.com/books/publisher/content?id=v-QfAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE7" } // using same cover for simplicity
    }
  },
  {
    id: "mock-7",
    etag: "mock-7",
    selfLink: "",
    volumeInfo: {
      title: "The Hobbit",
      authors: ["J.R.R. Tolkien"],
      imageLinks: { thumbnail: "https://books.google.com/books/content?id=YyXoAAAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" } // generic no-cover in API if not exist, but let's just use it
    }
  }
];

function getMockBooks(query: string): GoogleBooksResponse {
  // Simple deterministic shuffle based on query length to make rows look different
  const offset = query.length % MOCK_BOOKS_POOL.length;
  const shuffled = [...MOCK_BOOKS_POOL.slice(offset), ...MOCK_BOOKS_POOL.slice(0, offset)];
  return {
    kind: "books#volumes",
    totalItems: 5,
    items: shuffled.slice(0, 5),
  };
}

export async function searchBooks(
  query: string, 
  maxResults = 10, 
  startIndex = 0,
  orderBy?: "relevance" | "newest"
): Promise<GoogleBooksResponse> {
  const cacheKey = `search:${query}:${maxResults}:${startIndex}:${orderBy || "relevance"}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let url = `${GOOGLE_BOOKS_BASE_URL}/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&startIndex=${startIndex}`;
  if (orderBy) {
    url += `&orderBy=${orderBy}`;
  }
  url += getApiKey();

  try {
    const response = await fetchWithRetry(url);
    if (!response.ok) {
      console.warn(`Failed to fetch real books (${response.status}). Using mock data.`);
      return getMockBooks(query);
    }
    const data: GoogleBooksResponse = await response.json();
    setCached(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`Error fetching books: ${err}. Using mock data.`);
    return getMockBooks(query);
  }
}

export async function getBookDetails(volumeId: string): Promise<GoogleBookVolume> {
  // Handle mock book IDs
  if (volumeId.startsWith("mock-")) {
    const mockBook = MOCK_BOOKS_POOL.find(b => b.id === volumeId);
    if (mockBook) return mockBook as GoogleBookVolume;
    throw new Error("Mock book not found");
  }

  const cacheKey = `detail:${volumeId}`;
  const cached = getCached(cacheKey);
  if (cached && "id" in cached) return cached as unknown as GoogleBookVolume;

  const url = `${GOOGLE_BOOKS_BASE_URL}/volumes/${encodeURIComponent(volumeId)}?${getApiKey()}`;

  const response = await fetchWithRetry(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch book details for ${volumeId}: ${response.statusText}`);
  }

  const data = await response.json();
  setCached(cacheKey, data as unknown as GoogleBooksResponse);
  return data;
}

export async function fetchBooksByCategory(
  category: string, 
  maxResults = 10, 
  searchOptions?: { mood?: string, q?: string, orderBy?: "relevance" | "newest" },
  startIndex: number = 0
): Promise<GoogleBooksResponse> {
  const parts = [];
  
  if (searchOptions?.q) {
    parts.push(searchOptions.q);
  }
  
  if (category) {
    parts.push(`subject:${category}`);
  }
  
  if (searchOptions?.mood) {
    parts.push(`subject:${searchOptions.mood}`);
  }
  
  const query = parts.join(" ");
  return searchBooks(query, maxResults, startIndex, searchOptions?.orderBy);
}

export async function fetchUniqueBooksByCategory(
  category: string,
  targetCount: number,
  excludeIds: Set<string>,
  searchOptions?: { mood?: string, q?: string, orderBy?: "relevance" | "newest" },
  startIndex: number = 0,
  maxAttempts: number = 3
): Promise<{ items: GoogleBookVolume[], nextStartIndex: number }> {
  if (maxAttempts === 0) return { items: [], nextStartIndex: startIndex };

  // Google Books API hard-caps maxResults at 40. Requesting anything higher returns a 400.
  const batchSize = Math.min(40, Math.max(20, targetCount * 2));
  const response = await fetchBooksByCategory(category, batchSize, searchOptions, startIndex);
  
  const rawItems = response.items || [];
  const validItems: GoogleBookVolume[] = [];
  
  for (const book of rawItems) {
    // 1. Must have a valid cover image
    const hasCover = !!(book.volumeInfo?.imageLinks?.thumbnail || book.volumeInfo?.imageLinks?.smallThumbnail);
    // 2. Must not be a duplicate across any row
    const isDuplicate = excludeIds.has(book.id);
    
    if (hasCover && !isDuplicate) {
      validItems.push(book);
      excludeIds.add(book.id); // mark as seen globally
      
      if (validItems.length === targetCount) {
        break; // we have enough
      }
    }
  }

  // If we didn't get enough books and there might be more results from the API
  if (validItems.length < targetCount && rawItems.length > 0) {
    const remainingCount = targetCount - validItems.length;
    const nextStart = startIndex + batchSize;
    
    const more = await fetchUniqueBooksByCategory(
      category,
      remainingCount,
      excludeIds,
      searchOptions,
      nextStart,
      maxAttempts - 1
    );
    
    return {
      items: [...validItems, ...more.items],
      nextStartIndex: more.nextStartIndex
    };
  }

  return { items: validItems, nextStartIndex: startIndex + rawItems.length };
}