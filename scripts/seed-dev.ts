/**
 * BOOKIFY — Development Seed Script
 * ──────────────────────────────────
 * Purpose  : Populate an existing user account with rich mock reading data
 *            so every dashboard / screen has realistic content during local dev.
 *
 * Usage    : npm run seed:dev
 *
 * Safety   : Idempotent — every upsert uses a unique key.  Safe to run many
 *            times.  Only touches data owned by TARGET_EMAIL.  No schema changes.
 *
 * Password : If the account has no passwordHash, a bcrypt hash of
 *            "reader123" is assigned so you can log in locally via
 *            email / password.
 *
 * NOTE: "notes", "highlights", and "search history" are NOT in the Prisma
 *       schema, so they are not seeded. All other requested entities are covered.
 */

import {
  PrismaClient,
  BookSource,
  ReadingStatus,
  Mood,
  GoalPeriod,
  GoalTargetType,
  RewardType,
  NotificationType,
  RecommendationAlgorithm,
  AuthProvider,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── CONFIG ────────────────────────────────────────────────────────────────────
// Change TARGET_EMAIL to match the existing account you want to seed.
const TARGET_EMAIL = "reader@bookify.com";
const DEV_PASSWORD  = "reader123";
// ─────────────────────────────────────────────────────────────────────────────

// ── HELPERS ───────────────────────────────────────────────────────────────────
const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

const hoursAgo = (h: number): Date => {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d;
};

// ── STATIC DATA ───────────────────────────────────────────────────────────────

const GENRES = [
  { name: "Fantasy",            slug: "fantasy"            },
  { name: "Mystery",            slug: "mystery"            },
  { name: "Science Fiction",    slug: "science-fiction"    },
  { name: "Romance",            slug: "romance"            },
  { name: "Historical Fiction", slug: "historical-fiction" },
  { name: "Thriller",           slug: "thriller"           },
  { name: "Self-Help",          slug: "self-help"          },
  { name: "Biography",          slug: "biography"          },
  { name: "Horror",             slug: "horror"             },
  { name: "Literary Fiction",   slug: "literary-fiction"   },
];

const AUTHORS = [
  { name: "Rebecca Yarros",       bio: "New York Times bestselling author known for epic fantasy romances."              },
  { name: "Andy Weir",            bio: "Author of hard science fiction novels."                                          },
  { name: "Colleen Hoover",       bio: "Bestselling romance and new adult fiction author."                               },
  { name: "Brandon Sanderson",    bio: "Prolific epic fantasy author, creator of the Cosmere universe."                  },
  { name: "Tomi Adeyemi",         bio: "Author of the YA fantasy Children of Blood and Bone series."                    },
  { name: "Donna Tartt",          bio: "Pulitzer Prize-winning author of The Secret History."                            },
  { name: "Gillian Flynn",        bio: "Author of psychological thrillers including Gone Girl."                          },
  { name: "Taylor Jenkins Reid",  bio: "Author of contemporary fiction exploring fame and love."                         },
  { name: "Madeline Miller",      bio: "Author of mythology-inspired literary fiction."                                  },
  { name: "Matt Haig",            bio: "Author of novels and non-fiction about mental health and wonder."                },
];

interface BookDef {
  externalId:    string;
  source:        BookSource;
  isbn13:        string | null;
  title:         string;
  subtitle:      string | null;
  description:   string | null;
  coverUrl:      string | null;
  pageCount:     number;
  publishedDate: Date;
  publisher:     string;
  language:      string;
  averageRating: number;
  ratingsCount:  number;
  authorIdx:     number;
  genreIdxs:     number[];
  status:        ReadingStatus;
  currentPage:   number;
  finishedAt:    Date | null;
  startedAt:     Date | null;
  rating:        number | null;
  review:        string | null;
  mood:          Mood | null;
}

const BOOKS: BookDef[] = [
  {
    externalId:    "gbk-fourth-wing",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9781649374042",
    title:         "Fourth Wing",
    subtitle:      "The Empyrean Series",
    description:   "Twenty-year-old Violet Sorrengail was supposed to enter the Scribe Quadrant, but her mother—the commanding general—orders her into the rider's quadrant, where the chances of survival are slim.",
    coverUrl:      "https://books.google.com/books/content?id=fourth-wing&printsec=frontcover&img=1&zoom=1",
    pageCount:     517,
    publishedDate: new Date("2023-05-02"),
    publisher:     "Red Tower Books",
    language:      "en",
    averageRating: 4.6,
    ratingsCount:  284000,
    authorIdx:     0,
    genreIdxs:     [0, 3],
    status:        ReadingStatus.FINISHED,
    currentPage:   517,
    finishedAt:    daysAgo(14),
    startedAt:     daysAgo(28),
    rating:        5,
    review:        "Absolutely enthralling from the first page to the last. The world-building is rich, the romance is electric, and Violet is one of the most compelling protagonists I've read in years. Cannot wait for Iron Flame!",
    mood:          Mood.FANTASY_ESCAPE,
  },
  {
    externalId:    "gbk-the-martian",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9780804139021",
    title:         "The Martian",
    subtitle:      null,
    description:   "Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he's sure he'll be the first person to die there.",
    coverUrl:      "https://books.google.com/books/content?id=the-martian&printsec=frontcover&img=1&zoom=1",
    pageCount:     369,
    publishedDate: new Date("2014-02-11"),
    publisher:     "Crown Publishing",
    language:      "en",
    averageRating: 4.4,
    ratingsCount:  590000,
    authorIdx:     1,
    genreIdxs:     [2],
    status:        ReadingStatus.FINISHED,
    currentPage:   369,
    finishedAt:    daysAgo(45),
    startedAt:     daysAgo(60),
    rating:        5,
    review:        "Science fiction at its best. Mark Watney's voice is hilarious and genuine — I laughed out loud multiple times. Weir's technical accuracy makes the survival story feel completely believable.",
    mood:          Mood.ADVENTURE,
  },
  {
    externalId:    "gbk-it-ends-with-us",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9781501110375",
    title:         "It Ends with Us",
    subtitle:      null,
    description:   "Lily had never thought about her own happiness, until now. Her whirlwind romance with her boss leads to hard choices when she becomes entangled with domestic violence.",
    coverUrl:      "https://books.google.com/books/content?id=it-ends-with-us&printsec=frontcover&img=1&zoom=1",
    pageCount:     385,
    publishedDate: new Date("2016-08-02"),
    publisher:     "Atria Books",
    language:      "en",
    averageRating: 4.4,
    ratingsCount:  1200000,
    authorIdx:     2,
    genreIdxs:     [3, 9],
    status:        ReadingStatus.FINISHED,
    currentPage:   385,
    finishedAt:    daysAgo(90),
    startedAt:     daysAgo(96),
    rating:        4,
    review:        "Powerful and emotional. Colleen Hoover handled such a difficult subject with grace and honesty. I appreciated that the story doesn't romanticize or excuse abuse.",
    mood:          Mood.HEARTBROKEN,
  },
  {
    externalId:    "gbk-the-way-of-kings",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9780765365279",
    title:         "The Way of Kings",
    subtitle:      "The Stormlight Archive",
    description:   "Speak again the ancient oaths and return to men the Shards they once bore. The Knights Radiant must stand again.",
    coverUrl:      "https://books.google.com/books/content?id=way-of-kings&printsec=frontcover&img=1&zoom=1",
    pageCount:     1007,
    publishedDate: new Date("2010-08-31"),
    publisher:     "Tor Books",
    language:      "en",
    averageRating: 4.7,
    ratingsCount:  390000,
    authorIdx:     3,
    genreIdxs:     [0],
    status:        ReadingStatus.CURRENTLY_READING,
    currentPage:   412,
    finishedAt:    null,
    startedAt:     daysAgo(10),
    rating:        null,
    review:        null,
    mood:          Mood.DARK_ACADEMIA,
  },
  {
    externalId:    "gbk-children-of-blood-and-bone",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9781250170972",
    title:         "Children of Blood and Bone",
    subtitle:      "Legacy of Orisha",
    description:   "In a world where magic has been erased, Zelie Adeyemi fights to restore it and save her people.",
    coverUrl:      "https://books.google.com/books/content?id=children-of-blood&printsec=frontcover&img=1&zoom=1",
    pageCount:     525,
    publishedDate: new Date("2018-03-06"),
    publisher:     "Henry Holt",
    language:      "en",
    averageRating: 4.2,
    ratingsCount:  190000,
    authorIdx:     4,
    genreIdxs:     [0, 4],
    status:        ReadingStatus.WANT_TO_READ,
    currentPage:   0,
    finishedAt:    null,
    startedAt:     null,
    rating:        null,
    review:        null,
    mood:          null,
  },
  {
    externalId:    "gbk-the-secret-history",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9780679410348",
    title:         "The Secret History",
    subtitle:      null,
    description:   "A young man is seduced by the genius and beauty of five eccentric college students who commit a terrible crime.",
    coverUrl:      "https://books.google.com/books/content?id=secret-history&printsec=frontcover&img=1&zoom=1",
    pageCount:     559,
    publishedDate: new Date("1992-09-16"),
    publisher:     "Knopf",
    language:      "en",
    averageRating: 4.3,
    ratingsCount:  400000,
    authorIdx:     5,
    genreIdxs:     [1, 9],
    status:        ReadingStatus.FINISHED,
    currentPage:   559,
    finishedAt:    daysAgo(120),
    startedAt:     daysAgo(130),
    rating:        5,
    review:        "Dark academia at its finest. Tartt's prose is lush and hypnotic. The slow revelation of the murder and the psychological unraveling of the characters is masterfully done.",
    mood:          Mood.DARK_ACADEMIA,
  },
  {
    externalId:    "gbk-gone-girl",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9780307588371",
    title:         "Gone Girl",
    subtitle:      null,
    description:   "On the morning of their fifth wedding anniversary, Nick Dunne's wife Amy disappears. What follows is a tour de force of psychological suspense.",
    coverUrl:      "https://books.google.com/books/content?id=gone-girl&printsec=frontcover&img=1&zoom=1",
    pageCount:     432,
    publishedDate: new Date("2012-06-05"),
    publisher:     "Crown Publishing",
    language:      "en",
    averageRating: 4.1,
    ratingsCount:  980000,
    authorIdx:     6,
    genreIdxs:     [5, 1],
    status:        ReadingStatus.FINISHED,
    currentPage:   432,
    finishedAt:    daysAgo(200),
    startedAt:     daysAgo(206),
    rating:        4,
    review:        "Mind-bending psychological thriller with one of the most memorable twists in recent fiction. Amy Dunne is one of literature's great antiheroes.",
    mood:          Mood.MYSTERIOUS,
  },
  {
    externalId:    "gbk-daisy-jones",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9781524798628",
    title:         "Daisy Jones & The Six",
    subtitle:      null,
    description:   "In the late 1970s, rock band The Six and solo artist Daisy Jones take the world by storm. This is the oral history of their rise and fall.",
    coverUrl:      "https://books.google.com/books/content?id=daisy-jones&printsec=frontcover&img=1&zoom=1",
    pageCount:     369,
    publishedDate: new Date("2019-03-05"),
    publisher:     "Ballantine Books",
    language:      "en",
    averageRating: 4.2,
    ratingsCount:  320000,
    authorIdx:     7,
    genreIdxs:     [3, 9],
    status:        ReadingStatus.PAUSED,
    currentPage:   180,
    finishedAt:    null,
    startedAt:     daysAgo(50),
    rating:        null,
    review:        null,
    mood:          Mood.ROMANTIC,
  },
  {
    externalId:    "gbk-circe",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9780316556347",
    title:         "Circe",
    subtitle:      null,
    description:   "The daughter of Helios, Circe discovers her power of witchcraft and must face the forces of both gods and men.",
    coverUrl:      "https://books.google.com/books/content?id=circe&printsec=frontcover&img=1&zoom=1",
    pageCount:     393,
    publishedDate: new Date("2018-04-10"),
    publisher:     "Little, Brown",
    language:      "en",
    averageRating: 4.3,
    ratingsCount:  490000,
    authorIdx:     8,
    genreIdxs:     [0, 4, 9],
    status:        ReadingStatus.FINISHED,
    currentPage:   393,
    finishedAt:    daysAgo(160),
    startedAt:     daysAgo(168),
    rating:        5,
    review:        "Beautifully written. Miller's prose makes Greek mythology feel alive, urgent, and deeply human. Circe's journey from outcast to powerful witch is profoundly satisfying.",
    mood:          Mood.HOPEFUL,
  },
  {
    externalId:    "gbk-midnight-library",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9780525559474",
    title:         "The Midnight Library",
    subtitle:      null,
    description:   "Nora Seed finds a library that contains books filled with every possible life she could have lived. Between life and death is a chance to fix her regrets.",
    coverUrl:      "https://books.google.com/books/content?id=midnight-library&printsec=frontcover&img=1&zoom=1",
    pageCount:     304,
    publishedDate: new Date("2020-09-29"),
    publisher:     "Viking",
    language:      "en",
    averageRating: 4.2,
    ratingsCount:  670000,
    authorIdx:     9,
    genreIdxs:     [9, 6],
    status:        ReadingStatus.WANT_TO_READ,
    currentPage:   0,
    finishedAt:    null,
    startedAt:     null,
    rating:        null,
    review:        null,
    mood:          null,
  },
  {
    externalId:    "gbk-iron-flame",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9781649374172",
    title:         "Iron Flame",
    subtitle:      "The Empyrean Series",
    description:   "The sequel to Fourth Wing. Violet Sorrengail returns, navigating treachery and war while her bond with Xaden deepens.",
    coverUrl:      "https://books.google.com/books/content?id=iron-flame&printsec=frontcover&img=1&zoom=1",
    pageCount:     623,
    publishedDate: new Date("2023-11-07"),
    publisher:     "Red Tower Books",
    language:      "en",
    averageRating: 4.5,
    ratingsCount:  210000,
    authorIdx:     0,
    genreIdxs:     [0, 3],
    status:        ReadingStatus.WANT_TO_READ,
    currentPage:   0,
    finishedAt:    null,
    startedAt:     null,
    rating:        null,
    review:        null,
    mood:          null,
  },
  {
    externalId:    "gbk-project-hail-mary",
    source:        BookSource.GOOGLE_BOOKS,
    isbn13:        "9780593135204",
    title:         "Project Hail Mary",
    subtitle:      null,
    description:   "Ryland Grace is the sole survivor on a desperate, last-chance mission to save Earth from extinction. He wakes up alone, millions of miles from home.",
    coverUrl:      "https://books.google.com/books/content?id=project-hail-mary&printsec=frontcover&img=1&zoom=1",
    pageCount:     476,
    publishedDate: new Date("2021-05-04"),
    publisher:     "Ballantine Books",
    language:      "en",
    averageRating: 4.7,
    ratingsCount:  540000,
    authorIdx:     1,
    genreIdxs:     [2],
    status:        ReadingStatus.WANT_TO_READ,
    currentPage:   0,
    finishedAt:    null,
    startedAt:     null,
    rating:        null,
    review:        null,
    mood:          null,
  },
];

const ACHIEVEMENTS = [
  { key: "FIRST_BOOK",     name: "First Chapter",       description: "Finished your very first book.",             category: "Milestones", xpReward: 100,  coinReward: 50  },
  { key: "FIVE_BOOKS",     name: "Avid Reader",          description: "Finished 5 books.",                          category: "Milestones", xpReward: 200,  coinReward: 100 },
  { key: "TEN_BOOKS",      name: "Bookworm",             description: "Finished 10 books.",                         category: "Milestones", xpReward: 500,  coinReward: 250 },
  { key: "NIGHT_OWL",      name: "Night Owl",            description: "Logged a reading session after midnight.",   category: "Habits",     xpReward: 75,   coinReward: 25  },
  { key: "SPEED_READER",   name: "Speed Reader",         description: "Read 100 pages in one session.",             category: "Skills",     xpReward: 150,  coinReward: 75  },
  { key: "STREAK_7",       name: "Week Warrior",         description: "Maintained a 7-day reading streak.",         category: "Streaks",    xpReward: 250,  coinReward: 125 },
  { key: "STREAK_30",      name: "Month Master",         description: "Maintained a 30-day reading streak.",        category: "Streaks",    xpReward: 1000, coinReward: 500 },
  { key: "GENRE_FANTASY",  name: "Realm Walker",         description: "Read 3 Fantasy books.",                      category: "Genres",     xpReward: 200,  coinReward: 100 },
  { key: "GENRE_THRILLER", name: "Edge of Your Seat",   description: "Read 3 Thriller or Mystery books.",          category: "Genres",     xpReward: 200,  coinReward: 100 },
  { key: "MARATHONER",     name: "Reading Marathoner",   description: "Read for 3 or more hours in one day.",       category: "Skills",     xpReward: 300,  coinReward: 150 },
];

const REWARDS = [
  { key: "BADGE_BOOKWORM",       name: "Bookworm Badge",       description: "Awarded for finishing 10 books.",          type: RewardType.BADGE,        unlockCondition: "TEN_BOOKS"               },
  { key: "TITLE_REALM_WALKER",   name: "Realm Walker",         description: "Title for reading 3 Fantasy books.",       type: RewardType.TITLE,        unlockCondition: "GENRE_FANTASY_3_BOOKS"   },
  { key: "THEME_DARK_ACADEMIA",  name: "Dark Academia Theme",  description: "Unlockable dark academia app theme.",       type: RewardType.THEME,        unlockCondition: "DARK_ACADEMIA_5_SESSIONS"},
  { key: "FRAME_DRAGON",         name: "Dragon Avatar Frame",  description: "Dragon-themed avatar frame for your profile.", type: RewardType.AVATAR_FRAME, unlockCondition: "GENRE_FANTASY_10_BOOKS"},
  { key: "BADGE_STREAK_WARRIOR", name: "Streak Warrior Badge", description: "7-day reading streak maintained.",          type: RewardType.BADGE,        unlockCondition: "STREAK_7"                },
];

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Bookify Dev Seed — starting…\n");

  // ── 1. Find or create target user ──────────────────────────────────────────
  let user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });

  if (!user) {
    console.log(`  ℹ️  User ${TARGET_EMAIL} not found — creating dev account…`);
    const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);
    user = await prisma.user.create({
      data: {
        email:          TARGET_EMAIL,
        username:       "honey_reads",
        name:           "Honey Suthar",
        passwordHash,
        authProvider:   AuthProvider.EMAIL,
        emailVerified:  true,
        bio:            "Avid reader, fantasy fanatic, and occasional midnight-session addict.",
        readingLevel:   8,
        xp:             4250,
        coins:          820,
        currentStreak:  12,
        longestStreak:  34,
        lastReadDate:   daysAgo(0),
        totalBooksRead: 7,
        totalPagesRead: 3071,
      },
    });
    console.log(`  ✅  Created dev user: ${user.email}`);
  } else {
    console.log(`  ✅  Found existing user: ${user.email} (id: ${user.id})`);

    // Only assign dev password if the account currently has no password hash
    if (!user.passwordHash) {
      const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);
      user = await prisma.user.update({
        where: { id: user.id },
        data:  { passwordHash },
      });
      console.log(`  🔑  Assigned dev password "${DEV_PASSWORD}" to the account.`);
    } else {
      console.log(`  🔑  Account already has a password — skipping password assignment.`);
    }

    // Enrich profile stats only if they are still at defaults
    if (user.xp === 0 && user.totalBooksRead === 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          bio:            "Avid reader, fantasy fanatic, and occasional midnight-session addict.",
          readingLevel:   8,
          xp:             4250,
          coins:          820,
          currentStreak:  12,
          longestStreak:  34,
          lastReadDate:   daysAgo(0),
          totalBooksRead: 7,
          totalPagesRead: 3071,
        },
      });
      console.log(`  📊  Updated blank profile stats.`);
    }
  }

  const userId = user.id;

  // ── 2. Genres ──────────────────────────────────────────────────────────────
  console.log("\n  📚  Upserting genres…");
  const genreRecords: Record<string, { id: string }> = {};
  for (const g of GENRES) {
    const record = await prisma.genre.upsert({
      where:  { slug: g.slug },
      update: {},
      create: { name: g.name, slug: g.slug },
    });
    genreRecords[g.slug] = record;
  }
  console.log(`     → ${Object.keys(genreRecords).length} genres ready.`);

  // ── 3. Authors ─────────────────────────────────────────────────────────────
  console.log("\n  ✍️   Upserting authors…");
  const authorRecords: { id: string }[] = [];
  for (const a of AUTHORS) {
    const existing = await prisma.author.findFirst({ where: { name: a.name } });
    if (existing) {
      authorRecords.push(existing);
    } else {
      const created = await prisma.author.create({ data: { name: a.name, bio: a.bio } });
      authorRecords.push(created);
    }
  }
  console.log(`     → ${authorRecords.length} authors ready.`);

  // ── 4. Books ───────────────────────────────────────────────────────────────
  console.log("\n  📖  Upserting books…");
  const bookRecords: { id: string }[] = [];
  for (const b of BOOKS) {
    const book = await prisma.book.upsert({
      where:  { source_externalId: { source: b.source, externalId: b.externalId } },
      update: { title: b.title, coverUrl: b.coverUrl, pageCount: b.pageCount, averageRating: b.averageRating },
      create: {
        externalId:    b.externalId,
        source:        b.source,
        isbn13:        b.isbn13,
        title:         b.title,
        subtitle:      b.subtitle,
        description:   b.description,
        coverUrl:      b.coverUrl,
        pageCount:     b.pageCount,
        publishedDate: b.publishedDate,
        publisher:     b.publisher,
        language:      b.language,
        averageRating: b.averageRating,
        ratingsCount:  b.ratingsCount,
      },
    });
    bookRecords.push(book);

    // BookAuthor join
    const author = authorRecords[b.authorIdx];
    await prisma.bookAuthor.upsert({
      where:  { bookId_authorId: { bookId: book.id, authorId: author.id } },
      update: {},
      create: { bookId: book.id, authorId: author.id },
    });

    // BookGenre joins
    for (const gi of b.genreIdxs) {
      const genre = genreRecords[GENRES[gi].slug];
      if (!genre) continue;
      await prisma.bookGenre.upsert({
        where:  { bookId_genreId: { bookId: book.id, genreId: genre.id } },
        update: {},
        create: { bookId: book.id, genreId: genre.id },
      });
    }
  }
  console.log(`     → ${bookRecords.length} books ready.`);

  // ── 5. User Library ────────────────────────────────────────────────────────
  console.log("\n  🗄️   Upserting library entries…");
  for (let i = 0; i < BOOKS.length; i++) {
    const b    = BOOKS[i];
    const book = bookRecords[i];
    await prisma.userLibrary.upsert({
      where:  { userId_bookId: { userId, bookId: book.id } },
      update: { status: b.status, currentPage: b.currentPage },
      create: {
        userId,
        bookId:      book.id,
        status:      b.status,
        currentPage: b.currentPage,
        addedAt:     b.startedAt ?? daysAgo(Math.floor(Math.random() * 180 + 5)),
        startedAt:   b.startedAt,
        finishedAt:  b.finishedAt,
      },
    });
  }
  console.log(`     → ${BOOKS.length} library entries ready.`);

  // ── 6. Favorites ──────────────────────────────────────────────────────────
  console.log("\n  ❤️   Upserting favorites…");
  const favoriteIndices = [0, 1, 5, 8]; // Fourth Wing, The Martian, Secret History, Circe
  for (const i of favoriteIndices) {
    const book = bookRecords[i];
    await prisma.favorite.upsert({
      where:  { userId_bookId: { userId, bookId: book.id } },
      update: {},
      create: { userId, bookId: book.id },
    });
  }
  console.log(`     → ${favoriteIndices.length} favorites ready.`);

  // ── 7. Collections ─────────────────────────────────────────────────────────
  console.log("\n  📂  Upserting collections…");
  const collectionsData = [
    { name: "Fantasy Worlds",       description: "Epic fantasy novels that sweep you away to another realm.", isPublic: true,  bookIndices: [0, 3, 4, 10] },
    { name: "Mind-Benders",         description: "Psychological thrillers and mysteries that keep you guessing.", isPublic: false, bookIndices: [5, 6]        },
    { name: "Cozy Weekend Reads",   description: "Feel-good books perfect for a rainy Sunday afternoon.",     isPublic: true,  bookIndices: [9, 7]        },
  ];

  for (const col of collectionsData) {
    let colRecord = await prisma.collection.findFirst({ where: { userId, name: col.name } });
    if (!colRecord) {
      colRecord = await prisma.collection.create({
        data: { userId, name: col.name, description: col.description, isPublic: col.isPublic },
      });
    }
    for (const bi of col.bookIndices) {
      if (bi >= bookRecords.length) continue;
      const book = bookRecords[bi];
      await prisma.collectionBook.upsert({
        where:  { collectionId_bookId: { collectionId: colRecord.id, bookId: book.id } },
        update: {},
        create: { collectionId: colRecord.id, bookId: book.id },
      });
    }
  }
  console.log(`     → ${collectionsData.length} collections ready.`);

  // ── 8. Reading Sessions ────────────────────────────────────────────────────
  console.log("\n  ⏱️   Upserting reading sessions…");
  const sessionDefs = [
    // Fourth Wing — 8 sessions (finished)
    { bookIdx: 0, daysBack: 28, hour: 20, startPage: 0,   endPage: 65,  dur: 75,  mood: Mood.COZY           },
    { bookIdx: 0, daysBack: 26, hour: 20, startPage: 65,  endPage: 130, dur: 80,  mood: Mood.ADVENTURE       },
    { bookIdx: 0, daysBack: 24, hour: 21, startPage: 130, endPage: 200, dur: 90,  mood: Mood.FANTASY_ESCAPE  },
    { bookIdx: 0, daysBack: 22, hour: 20, startPage: 200, endPage: 270, dur: 85,  mood: Mood.FANTASY_ESCAPE  },
    { bookIdx: 0, daysBack: 20, hour: 21, startPage: 270, endPage: 350, dur: 95,  mood: Mood.MOTIVATED       },
    { bookIdx: 0, daysBack: 18, hour: 20, startPage: 350, endPage: 420, dur: 80,  mood: Mood.ROMANTIC        },
    { bookIdx: 0, daysBack: 16, hour: 22, startPage: 420, endPage: 480, dur: 70,  mood: Mood.FANTASY_ESCAPE  },
    { bookIdx: 0, daysBack: 14, hour: 20, startPage: 480, endPage: 517, dur: 50,  mood: Mood.HOPEFUL         },
    // The Martian — 5 sessions
    { bookIdx: 1, daysBack: 60, hour: 19, startPage: 0,   endPage: 80,  dur: 90,  mood: Mood.ADVENTURE       },
    { bookIdx: 1, daysBack: 57, hour: 20, startPage: 80,  endPage: 170, dur: 100, mood: Mood.MOTIVATED       },
    { bookIdx: 1, daysBack: 54, hour: 20, startPage: 170, endPage: 260, dur: 100, mood: Mood.HAPPY           },
    { bookIdx: 1, daysBack: 50, hour: 21, startPage: 260, endPage: 320, dur: 70,  mood: Mood.ADVENTURE       },
    { bookIdx: 1, daysBack: 45, hour: 20, startPage: 320, endPage: 369, dur: 60,  mood: Mood.HOPEFUL         },
    // It Ends with Us — 4 sessions
    { bookIdx: 2, daysBack: 96, hour: 20, startPage: 0,   endPage: 100, dur: 110, mood: Mood.COZY            },
    { bookIdx: 2, daysBack: 94, hour: 21, startPage: 100, endPage: 220, dur: 120, mood: Mood.ROMANTIC        },
    { bookIdx: 2, daysBack: 92, hour: 20, startPage: 220, endPage: 320, dur: 110, mood: Mood.HEARTBROKEN     },
    { bookIdx: 2, daysBack: 90, hour: 21, startPage: 320, endPage: 385, dur: 80,  mood: Mood.HEARTBROKEN     },
    // The Way of Kings — 4 sessions (currently reading)
    { bookIdx: 3, daysBack: 10, hour: 20, startPage: 0,   endPage: 100, dur: 110, mood: Mood.DARK_ACADEMIA   },
    { bookIdx: 3, daysBack: 8,  hour: 21, startPage: 100, endPage: 210, dur: 120, mood: Mood.DARK_ACADEMIA   },
    { bookIdx: 3, daysBack: 5,  hour: 20, startPage: 210, endPage: 310, dur: 115, mood: Mood.MOTIVATED       },
    { bookIdx: 3, daysBack: 2,  hour: 20, startPage: 310, endPage: 412, dur: 120, mood: Mood.ADVENTURE       },
    // The Secret History — 3 sessions
    { bookIdx: 5, daysBack: 130, hour: 21, startPage: 0,   endPage: 190, dur: 120, mood: Mood.DARK_ACADEMIA  },
    { bookIdx: 5, daysBack: 127, hour: 20, startPage: 190, endPage: 380, dur: 130, mood: Mood.MYSTERIOUS      },
    { bookIdx: 5, daysBack: 120, hour: 22, startPage: 380, endPage: 559, dur: 120, mood: Mood.DARK_ACADEMIA   },
    // Gone Girl — 3 sessions
    { bookIdx: 6, daysBack: 206, hour: 20, startPage: 0,   endPage: 150, dur: 100, mood: Mood.MYSTERIOUS      },
    { bookIdx: 6, daysBack: 204, hour: 21, startPage: 150, endPage: 300, dur: 110, mood: Mood.MYSTERIOUS      },
    { bookIdx: 6, daysBack: 200, hour: 20, startPage: 300, endPage: 432, dur: 90,  mood: Mood.CALM            },
    // Circe — 3 sessions
    { bookIdx: 8, daysBack: 168, hour: 20, startPage: 0,   endPage: 130, dur: 95,  mood: Mood.RAINY_DAY       },
    { bookIdx: 8, daysBack: 165, hour: 19, startPage: 130, endPage: 270, dur: 100, mood: Mood.HOPEFUL         },
    { bookIdx: 8, daysBack: 160, hour: 20, startPage: 270, endPage: 393, dur: 90,  mood: Mood.HOPEFUL         },
    // Daisy Jones — 2 sessions (paused)
    { bookIdx: 7, daysBack: 50, hour: 20, startPage: 0,   endPage: 90,  dur: 70,  mood: Mood.ROMANTIC        },
    { bookIdx: 7, daysBack: 45, hour: 21, startPage: 90,  endPage: 180, dur: 80,  mood: Mood.HAPPY           },
    // Recent streak sessions
    { bookIdx: 3, daysBack: 1,  hour: 21, startPage: 400, endPage: 412, dur: 40,  mood: Mood.ADVENTURE       },
    { bookIdx: 3, daysBack: 0,  hour: 20, startPage: 412, endPage: 412, dur: 30,  mood: Mood.CALM            },
  ];

  let sessionsCreated = 0;
  for (const s of sessionDefs) {
    if (s.bookIdx >= bookRecords.length) continue;
    const book    = bookRecords[s.bookIdx];
    const started = new Date(daysAgo(s.daysBack));
    started.setHours(s.hour, 0, 0, 0);
    const ended = new Date(started.getTime() + s.dur * 60 * 1000);

    const existing = await prisma.readingSession.findFirst({
      where: {
        userId,
        bookId:    book.id,
        startedAt: {
          gte: new Date(started.getTime() - 60_000),
          lte: new Date(started.getTime() + 60_000),
        },
      },
    });
    if (!existing) {
      await prisma.readingSession.create({
        data: {
          userId,
          bookId:          book.id,
          startPage:       s.startPage,
          endPage:         s.endPage,
          pagesRead:       s.endPage - s.startPage,
          durationMinutes: s.dur,
          mood:            s.mood,
          startedAt:       started,
          endedAt:         ended,
        },
      });
      sessionsCreated++;
    }
  }
  console.log(`     → ${sessionsCreated} new reading sessions created (skipped existing).`);

  // ── 9. Streak Logs ─────────────────────────────────────────────────────────
  console.log("\n  🔥  Upserting streak logs…");
  const streakDays = [
    { d: 0,   pages: 30,  mins: 30,  xp: 30  },
    { d: 1,   pages: 40,  mins: 40,  xp: 40  },
    { d: 2,   pages: 102, mins: 120, xp: 120 },
    { d: 5,   pages: 100, mins: 115, xp: 115 },
    { d: 6,   pages: 110, mins: 120, xp: 120 },
    { d: 7,   pages: 90,  mins: 95,  xp: 95  },
    { d: 8,   pages: 110, mins: 120, xp: 120 },
    { d: 10,  pages: 100, mins: 110, xp: 110 },
    { d: 14,  pages: 65,  mins: 75,  xp: 75  },
    { d: 16,  pages: 65,  mins: 80,  xp: 80  },
    { d: 18,  pages: 80,  mins: 90,  xp: 90  },
    { d: 20,  pages: 80,  mins: 95,  xp: 95  },
    { d: 22,  pages: 70,  mins: 85,  xp: 85  },
    { d: 24,  pages: 70,  mins: 90,  xp: 90  },
    { d: 26,  pages: 65,  mins: 80,  xp: 80  },
    { d: 28,  pages: 65,  mins: 75,  xp: 75  },
    { d: 45,  pages: 49,  mins: 60,  xp: 60  },
    { d: 50,  pages: 57,  mins: 70,  xp: 70  },
    { d: 54,  pages: 90,  mins: 100, xp: 100 },
    { d: 57,  pages: 90,  mins: 100, xp: 100 },
    { d: 60,  pages: 80,  mins: 90,  xp: 90  },
    { d: 90,  pages: 65,  mins: 80,  xp: 80  },
    { d: 92,  pages: 100, mins: 110, xp: 110 },
    { d: 94,  pages: 120, mins: 120, xp: 120 },
    { d: 96,  pages: 100, mins: 110, xp: 110 },
    { d: 120, pages: 80,  mins: 90,  xp: 90  },
    { d: 127, pages: 90,  mins: 100, xp: 100 },
    { d: 130, pages: 85,  mins: 95,  xp: 95  },
    { d: 160, pages: 70,  mins: 80,  xp: 80  },
    { d: 165, pages: 90,  mins: 100, xp: 100 },
    { d: 168, pages: 95,  mins: 95,  xp: 95  },
    { d: 200, pages: 90,  mins: 90,  xp: 90  },
    { d: 204, pages: 110, mins: 110, xp: 110 },
    { d: 206, pages: 100, mins: 100, xp: 100 },
  ];

  for (const sl of streakDays) {
    const date = daysAgo(sl.d);
    await prisma.streakLog.upsert({
      where:  { userId_date: { userId, date } },
      update: { pagesRead: sl.pages, minutesRead: sl.mins, xpEarned: sl.xp },
      create: { userId, date, pagesRead: sl.pages, minutesRead: sl.mins, xpEarned: sl.xp },
    });
  }
  console.log(`     → ${streakDays.length} streak log rows upserted.`);

  // ── 10. Reading Goals ──────────────────────────────────────────────────────
  console.log("\n  🎯  Upserting reading goals…");
  const now        = new Date();
  const yearStart  = new Date(now.getFullYear(), 0, 1);
  const yearEnd    = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const weekStart  = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const goalsData = [
    { period: GoalPeriod.YEARLY,  targetType: GoalTargetType.BOOKS,   targetValue: 24,   currentValue: 7,   achieved: false, periodStart: yearStart,  periodEnd: yearEnd  },
    { period: GoalPeriod.MONTHLY, targetType: GoalTargetType.BOOKS,   targetValue: 2,    currentValue: 1,   achieved: false, periodStart: monthStart, periodEnd: monthEnd },
    { period: GoalPeriod.MONTHLY, targetType: GoalTargetType.PAGES,   targetValue: 1500, currentValue: 412, achieved: false, periodStart: monthStart, periodEnd: monthEnd },
    { period: GoalPeriod.WEEKLY,  targetType: GoalTargetType.MINUTES, targetValue: 300,  currentValue: 210, achieved: false, periodStart: weekStart,  periodEnd: weekEnd  },
  ];

  for (const g of goalsData) {
    const existing = await prisma.readingGoal.findFirst({
      where: { userId, period: g.period, periodStart: g.periodStart, targetType: g.targetType },
    });
    if (!existing) {
      await prisma.readingGoal.create({ data: { userId, ...g } });
    }
  }
  console.log(`     → ${goalsData.length} reading goals ready.`);

  // ── 11. Reading Stats ──────────────────────────────────────────────────────
  console.log("\n  📊  Upserting reading stats…");
  const statsData = [
    { period: GoalPeriod.YEARLY,  periodStart: yearStart,  booksFinished: 7, pagesRead: 3071, minutesRead: 3170, avgPagesPerSession: 78.2, longestSessionMin: 130, consistencyScore: 0.62 },
    { period: GoalPeriod.MONTHLY, periodStart: monthStart, booksFinished: 0, pagesRead: 412,  minutesRead: 390,  avgPagesPerSession: 82.4, longestSessionMin: 120, consistencyScore: 0.50 },
    { period: GoalPeriod.WEEKLY,  periodStart: weekStart,  booksFinished: 0, pagesRead: 70,   minutesRead: 70,   avgPagesPerSession: 35.0, longestSessionMin: 40,  consistencyScore: 0.57 },
  ];

  for (const s of statsData) {
    await prisma.readingStats.upsert({
      where:  { userId_period_periodStart: { userId, period: s.period, periodStart: s.periodStart } },
      update: { booksFinished: s.booksFinished, pagesRead: s.pagesRead, minutesRead: s.minutesRead, avgPagesPerSession: s.avgPagesPerSession, longestSessionMin: s.longestSessionMin, consistencyScore: s.consistencyScore },
      create: { userId, ...s },
    });
  }
  console.log(`     → ${statsData.length} stat rows upserted.`);

  // ── 12. Achievements ───────────────────────────────────────────────────────
  console.log("\n  🏆  Upserting achievements & user achievements…");
  const achievementRecords: Record<string, { id: string }> = {};
  for (const a of ACHIEVEMENTS) {
    const record = await prisma.achievement.upsert({
      where:  { key: a.key },
      update: { name: a.name, description: a.description, xpReward: a.xpReward, coinReward: a.coinReward },
      create: { ...a },
    });
    achievementRecords[a.key] = record;
  }

  // Mark 7 of the 10 achievements as earned
  const earnedKeys = [
    "FIRST_BOOK", "FIVE_BOOKS", "NIGHT_OWL",
    "SPEED_READER", "STREAK_7", "GENRE_FANTASY", "GENRE_THRILLER",
  ];
  for (const key of earnedKeys) {
    const achievement = achievementRecords[key];
    await prisma.userAchievement.upsert({
      where:  { userId_achievementId: { userId, achievementId: achievement.id } },
      update: {},
      create: { userId, achievementId: achievement.id, earnedAt: daysAgo(Math.floor(Math.random() * 90 + 5)) },
    });
  }
  console.log(`     → ${ACHIEVEMENTS.length} achievement definitions, ${earnedKeys.length} earned.`);

  // ── 13. Rewards ────────────────────────────────────────────────────────────
  console.log("\n  🎁  Upserting rewards & user rewards…");
  const rewardRecords: Record<string, { id: string }> = {};
  for (const r of REWARDS) {
    const record = await prisma.reward.upsert({
      where:  { key: r.key },
      update: { name: r.name, description: r.description },
      create: { ...r },
    });
    rewardRecords[r.key] = record;
  }

  const unlockedRewardKeys: { key: string; equipped: boolean }[] = [
    { key: "BADGE_BOOKWORM",       equipped: false },
    { key: "TITLE_REALM_WALKER",   equipped: true  }, // currently equipped title
    { key: "BADGE_STREAK_WARRIOR", equipped: false },
  ];
  for (const ur of unlockedRewardKeys) {
    const reward = rewardRecords[ur.key];
    await prisma.userReward.upsert({
      where:  { userId_rewardId: { userId, rewardId: reward.id } },
      update: {},
      create: { userId, rewardId: reward.id, isEquipped: ur.equipped },
    });
  }
  console.log(`     → ${REWARDS.length} reward definitions, ${unlockedRewardKeys.length} unlocked.`);

  // ── 14. Ratings ────────────────────────────────────────────────────────────
  console.log("\n  ⭐  Upserting ratings…");
  const ratingData = [
    { idx: 0, score: 5 }, // Fourth Wing
    { idx: 1, score: 5 }, // The Martian
    { idx: 2, score: 4 }, // It Ends with Us
    { idx: 5, score: 5 }, // The Secret History
    { idx: 6, score: 4 }, // Gone Girl
    { idx: 8, score: 5 }, // Circe
  ];
  for (const r of ratingData) {
    const book = bookRecords[r.idx];
    await prisma.rating.upsert({
      where:  { userId_bookId: { userId, bookId: book.id } },
      update: { score: r.score },
      create: { userId, bookId: book.id, score: r.score },
    });
  }
  console.log(`     → ${ratingData.length} ratings upserted.`);

  // ── 15. Reviews ────────────────────────────────────────────────────────────
  console.log("\n  ✏️   Upserting reviews…");
  let reviewCount = 0;
  for (let i = 0; i < BOOKS.length; i++) {
    const b = BOOKS[i];
    if (!b.review) continue;
    const book = bookRecords[i];
    await prisma.review.upsert({
      where:  { userId_bookId: { userId, bookId: book.id } },
      update: { content: b.review },
      create: { userId, bookId: book.id, content: b.review, containsSpoilers: false },
    });
    reviewCount++;
  }
  console.log(`     → ${reviewCount} reviews upserted.`);

  // ── 16. Personality Profile ────────────────────────────────────────────────
  console.log("\n  🧠  Upserting personality profile…");
  await prisma.personalityProfile.upsert({
    where:  { userId },
    update: {
      genreDistribution: { Fantasy: 42, Mystery: 21, Romance: 15, "Science Fiction": 14, "Literary Fiction": 8 },
      archetype:         "The Midnight Librarian",
      summary:           "You are drawn to immersive fantasy worlds and complex characters. You tend to read in focused evening sessions and rarely abandon a book once started. Your taste skews towards high-stakes stories with emotional depth.",
      strengths:         ["Consistent evening reader", "Rarely abandons books (DNF rate: 3%)", "Diverse genre palate", "High average rating — discerning taste"],
      computedAt:        new Date(),
    },
    create: {
      userId,
      genreDistribution: { Fantasy: 42, Mystery: 21, Romance: 15, "Science Fiction": 14, "Literary Fiction": 8 },
      archetype:         "The Midnight Librarian",
      summary:           "You are drawn to immersive fantasy worlds and complex characters. You tend to read in focused evening sessions and rarely abandon a book once started. Your taste skews towards high-stakes stories with emotional depth.",
      strengths:         ["Consistent evening reader", "Rarely abandons books (DNF rate: 3%)", "Diverse genre palate", "High average rating — discerning taste"],
    },
  });
  console.log(`     → Personality profile ready.`);

  // ── 17. Mood History ───────────────────────────────────────────────────────
  console.log("\n  😊  Inserting mood history…");
  const moodEntries = [
    { bookIdx: 0, mood: Mood.FANTASY_ESCAPE, daysBack: 14, hour: 21 },
    { bookIdx: 0, mood: Mood.HOPEFUL,        daysBack: 14, hour: 22 },
    { bookIdx: 3, mood: Mood.DARK_ACADEMIA,  daysBack: 10, hour: 20 },
    { bookIdx: 3, mood: Mood.DARK_ACADEMIA,  daysBack: 8,  hour: 21 },
    { bookIdx: 3, mood: Mood.MOTIVATED,      daysBack: 5,  hour: 20 },
    { bookIdx: 3, mood: Mood.ADVENTURE,      daysBack: 2,  hour: 20 },
    { bookIdx: 3, mood: Mood.CALM,           daysBack: 1,  hour: 21 },
    { bookIdx: 3, mood: Mood.ADVENTURE,      daysBack: 0,  hour: 20 },
  ];

  let moodCount = 0;
  for (const m of moodEntries) {
    if (m.bookIdx >= bookRecords.length) continue;
    const book     = bookRecords[m.bookIdx];
    const loggedAt = new Date(daysAgo(m.daysBack));
    loggedAt.setHours(m.hour, 30, 0, 0);

    const existing = await prisma.moodHistory.findFirst({
      where: {
        userId,
        bookId:   book.id,
        loggedAt: {
          gte: new Date(loggedAt.getTime() - 60_000),
          lte: new Date(loggedAt.getTime() + 60_000),
        },
      },
    });
    if (!existing) {
      await prisma.moodHistory.create({
        data: { userId, mood: m.mood, bookId: book.id, loggedAt },
      });
      moodCount++;
    }
  }
  console.log(`     → ${moodCount} mood history entries created.`);

  // ── 18. Recommendations ────────────────────────────────────────────────────
  console.log("\n  💡  Upserting recommendations…");
  const recommendationsData = [
    { bookIdx: 10, algorithm: RecommendationAlgorithm.BECAUSE_YOU_READ, reason: "Because you loved Fourth Wing",               score: 0.97 },
    { bookIdx: 11, algorithm: RecommendationAlgorithm.BECAUSE_YOU_READ, reason: "Because you loved The Martian",               score: 0.95 },
    { bookIdx: 11, algorithm: RecommendationAlgorithm.EDITORS_PICK,     reason: "Editor's Pick — Best Sci-Fi of 2021",         score: 0.92 },
    { bookIdx: 4,  algorithm: RecommendationAlgorithm.GENRE_AFFINITY,   reason: "Matches your love for Fantasy",               score: 0.88 },
    { bookIdx: 9,  algorithm: RecommendationAlgorithm.MOOD_MATCH,       reason: "Perfect for a hopeful, reflective mood",      score: 0.85 },
    { bookIdx: 7,  algorithm: RecommendationAlgorithm.COLLABORATIVE,    reason: "Readers like you are loving this right now",  score: 0.80 },
  ];

  let recCount = 0;
  for (const rec of recommendationsData) {
    if (rec.bookIdx >= bookRecords.length) continue;
    const book = bookRecords[rec.bookIdx];
    await prisma.recommendation.upsert({
      where:  { userId_bookId_algorithm: { userId, bookId: book.id, algorithm: rec.algorithm } },
      update: { reason: rec.reason, score: rec.score },
      create: { userId, bookId: book.id, algorithm: rec.algorithm, reason: rec.reason, score: rec.score },
    });
    recCount++;
  }
  console.log(`     → ${recCount} recommendations upserted.`);

  // ── 19. Notifications ──────────────────────────────────────────────────────
  console.log("\n  🔔  Inserting notifications (if < 10 exist for this user)…");
  const existingNotifCount = await prisma.notification.count({ where: { userId } });
  if (existingNotifCount < 10) {
    const notifs = [
      { type: NotificationType.STREAK,               title: "🔥 12-Day Streak!",             body: "You are on a 12-day reading streak! Keep it going tonight.",                 isRead: false, createdAt: hoursAgo(2),   metadata: { streakDays: 12 }                             },
      { type: NotificationType.ACHIEVEMENT_UNLOCKED,  title: "🏆 Achievement Unlocked!",      body: "You earned the 'Week Warrior' badge for a 7-day streak!",                    isRead: false, createdAt: hoursAgo(26),  metadata: { achievementKey: "STREAK_7" }                 },
      { type: NotificationType.GOAL_COMPLETED,        title: "✅ Monthly Goal Progress",      body: "You have read 412 pages this month — 27% of your 1500-page goal.",           isRead: true,  createdAt: hoursAgo(50),  metadata: { goalType: "PAGES", current: 412, target: 1500 } },
      { type: NotificationType.NEW_RECOMMENDATION,    title: "📚 New Book For You",           body: "Iron Flame is waiting! Continue the adventure from Fourth Wing.",            isRead: true,  createdAt: hoursAgo(72),  metadata: { bookTitle: "Iron Flame" }                    },
      { type: NotificationType.READING_REMINDER,      title: "⏰ Time to Read!",               body: "You haven't opened The Way of Kings today. Even 20 pages counts!",          isRead: true,  createdAt: hoursAgo(100), metadata: {}                                             },
      { type: NotificationType.ACHIEVEMENT_UNLOCKED,  title: "🏆 Achievement Unlocked!",      body: "You earned 'Realm Walker' for reading 3 Fantasy books!",                     isRead: true,  createdAt: daysAgo(5),    metadata: { achievementKey: "GENRE_FANTASY" }             },
      { type: NotificationType.STREAK,               title: "🔥 Don't Break Your Streak!",   body: "Read at least 1 page tonight to keep your 11-day streak alive.",             isRead: true,  createdAt: daysAgo(6),    metadata: { streakDays: 11 }                             },
      { type: NotificationType.GOAL_COMPLETED,        title: "🎉 Weekly Goal Achieved!",      body: "You crushed your weekly reading goal of 300 minutes. Awesome!",              isRead: true,  createdAt: daysAgo(10),   metadata: { goalType: "MINUTES", achieved: true }         },
      { type: NotificationType.NEW_RECOMMENDATION,    title: "✨ Picked For You",              body: "Project Hail Mary by Andy Weir — because you loved The Martian!",           isRead: true,  createdAt: daysAgo(14),   metadata: { bookTitle: "Project Hail Mary" }              },
      { type: NotificationType.ACHIEVEMENT_UNLOCKED,  title: "🏆 Achievement Unlocked!",      body: "You finished your first book — 'First Chapter' badge earned!",               isRead: true,  createdAt: daysAgo(200),  metadata: { achievementKey: "FIRST_BOOK" }                },
    ];

    for (const n of notifs) {
      await prisma.notification.create({
        data: {
          userId,
          type:      n.type,
          title:     n.title,
          body:      n.body,
          isRead:    n.isRead,
          metadata:  n.metadata,
          createdAt: n.createdAt,
        },
      });
    }
    console.log(`     → ${notifs.length} notifications created.`);
  } else {
    console.log(`     → ${existingNotifCount} notifications already exist — skipping.`);
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  console.log("\n✅  Seed complete!\n");
  console.log(`   Email    : ${TARGET_EMAIL}`);
  console.log(`   Password : ${DEV_PASSWORD}  (local dev only)`);
  console.log(`\n   Library        : ${BOOKS.length} books`);
  console.log(`   Sessions       : ${sessionDefs.length} reading sessions`);
  console.log(`   Streak logs    : ${streakDays.length} daily entries`);
  console.log(`   Streak         : 12-day current / 34-day longest`);
  console.log(`   XP / Coins     : 4250 / 820`);
  console.log(`   Achievements   : ${ACHIEVEMENTS.length} defined, ${earnedKeys.length} earned`);
  console.log(`   Rewards        : ${REWARDS.length} defined, ${unlockedRewardKeys.length} unlocked`);
  console.log(`   Ratings        : ${ratingData.length}`);
  console.log(`   Reviews        : ${reviewCount}`);
  console.log(`   Recommendations: ${recCount}`);
  console.log(`   Notifications  : 10\n`);
  console.log("  ⚠️  Note: 'notes', 'highlights', and 'search history' are not in the Prisma");
  console.log("     schema and therefore could not be seeded.\n");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
