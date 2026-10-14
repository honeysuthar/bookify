import prisma from '../prisma'
import { User, Prisma } from '@prisma/client'

/**
 * Creates a new user in the database.
 */
export async function createUser(data: {
  email: string
  username: string
  passwordHash?: string
  authProvider?: 'EMAIL' | 'GOOGLE'
  name: string
  avatarUrl?: string
  bio?: string
}): Promise<User> {
  try {
    return await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
        authProvider: data.authProvider || 'EMAIL',
        name: data.name,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
      },
    })
  } catch (error) {
    console.error('Error in createUser:', error)
    throw error
  }
}

/**
 * Retrieves a user by their ID.
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error in getUserById:', error)
    throw error
  }
}

/**
 * Retrieves a user by their email address.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
    })
  } catch (error) {
    console.error('Error in getUserByEmail:', error)
    throw error
  }
}

/**
 * Retrieves a user by their username.
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { username },
    })
  } catch (error) {
    console.error('Error in getUserByUsername:', error)
    throw error
  }
}

/**
 * Updates a user's details.
 */
export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
): Promise<User> {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error('Error in updateUser:', error)
    throw error
  }
}

/**
 * Deletes a user by their ID.
 */
export async function deleteUser(id: string): Promise<User> {
  try {
    return await prisma.user.delete({
      where: { id },
    })
  } catch (error) {
    console.error('Error in deleteUser:', error)
    throw error
  }
}
