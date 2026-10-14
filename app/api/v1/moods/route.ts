import { NextResponse } from "next/server";

const MOODS = [
  { value: "cozy", label: "Cozy" },
  { value: "adventure", label: "Adventure" },
  { value: "romance", label: "Romantic" },
  { value: "mystery", label: "Mysterious" },
  { value: "motivation", label: "Motivated" },
  { value: "hope", label: "Hopeful" },
];

export async function GET() {
  return NextResponse.json({ moods: MOODS });
}