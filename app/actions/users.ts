"use server";

import { createUser, getUserById, getUserByEmail, getUserByUsername, updateUser, deleteUser } from "@/lib/db/users"
import { User, Prisma } from "@prisma/client"
import { getSessionUserId } from "@/lib/auth"

export interface ActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Server Action to create a user profile.
 */
export async function createUserAction(data: {
  email: string
  username: string
  passwordHash?: string
  authProvider?: 'EMAIL' | 'GOOGLE'
  name: string
  avatarUrl?: string
  bio?: string
}): Promise<ActionResponse<User>> {
  try {
    if (!data.email || !data.username || !data.name) {
      return { success: false, error: "Missing required fields (email, username, and name are required)" }
    }
    const user = await createUser(data)
    return { success: true, data: user }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user" }
  }
}

/**
 * Server Action to fetch a user profile by ID.
 */
export async function getUserByIdAction(id: string): Promise<ActionResponse<User | null>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualId = sessionUserId || id
    if (!actualId) {
      return { success: false, error: "User ID is required" }
    }
    const user = await getUserById(actualId)
    return { success: true, data: user }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch user" }
  }
}

/**
 * Server Action to update a user profile.
 */
export async function updateUserAction(
  id: string,
  data: Prisma.UserUpdateInput
): Promise<ActionResponse<User>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualId = sessionUserId || id
    if (!actualId) {
      return { success: false, error: "User ID is required" }
    }
    const updatedUser = await updateUser(actualId, data)
    return { success: true, data: updatedUser }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user" }
  }
}

/**
 * Server Action to delete a user profile.
 */
export async function deleteUserAction(id: string): Promise<ActionResponse<User>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualId = sessionUserId || id
    if (!actualId) {
      return { success: false, error: "User ID is required" }
    }
    const deletedUser = await deleteUser(actualId)
    return { success: true, data: deletedUser }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete user" }
  }
}
