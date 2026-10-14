"use server";

import {
  getUserSettings,
  updateProfile,
  saveReadingGoal,
  deleteAccount,
  UserSettingsData,
} from "@/lib/db/settings";
import { getSessionUserId } from "@/lib/auth";
import { ActionResponse } from "./users";
import { GoalPeriod, GoalTargetType } from "@prisma/client";

/**
 * Server Action to retrieve settings, profile, and goals for the authenticated user.
 */
export async function getUserSettingsAction(): Promise<ActionResponse<UserSettingsData>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const data = await getUserSettings(userId);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return { success: false, error: error.message || "Failed to load settings" };
  }
}

/**
 * Server Action to update profile details.
 */
export async function updateProfileAction(data: {
  name?: string;
  username?: string;
  bio?: string;
}): Promise<ActionResponse<boolean>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await updateProfile(userId, data);
    return { success: true, data: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

/**
 * Server Action to update reading goals.
 */
export async function saveReadingGoalAction(
  period: GoalPeriod,
  targetType: GoalTargetType,
  targetValue: number
): Promise<ActionResponse<boolean>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await saveReadingGoal(userId, period, targetType, targetValue);
    return { success: true, data: true };
  } catch (error: any) {
    console.error("Failed to save reading goal:", error);
    return { success: false, error: error.message || "Failed to save reading goal" };
  }
}

/**
 * Server Action to delete account permanently.
 */
export async function deleteAccountAction(): Promise<ActionResponse<boolean>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await deleteAccount(userId);
    return { success: true, data: true };
  } catch (error: any) {
    console.error("Failed to delete account:", error);
    return { success: false, error: error.message || "Failed to delete account" };
  }
}
