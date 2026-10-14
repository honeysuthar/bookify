"use server";

import { getUserAchievementsData, AchievementsData } from "@/lib/db/achievements";
import { getSessionUserId } from "@/lib/auth";
import { ActionResponse } from "./users";

/**
 * Server Action to retrieve real-time achievements and progression for the authenticated user.
 */
export async function getAchievementsAction(): Promise<ActionResponse<AchievementsData>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const data = await getUserAchievementsData(userId);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to get achievements:", error);
    return { success: false, error: error.message || "Failed to load achievements" };
  }
}
