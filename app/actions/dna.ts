"use server";

import { computeUserReadingDNA, ReadingDNAData } from "@/lib/db/dna";
import { getSessionUserId } from "@/lib/auth";
import { ActionResponse } from "./users";

/**
 * Server Action to retrieve or recalculate the Reading DNA for the authenticated user.
 */
export async function getReadingDNAAction(): Promise<ActionResponse<ReadingDNAData>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const dna = await computeUserReadingDNA(userId);
    return { success: true, data: dna };
  } catch (error: any) {
    console.error("Failed to get reading DNA:", error);
    return { success: false, error: error.message || "Failed to load Reading DNA" };
  }
}
