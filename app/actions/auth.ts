"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerAction(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const { email, username, name, password } = data;
    if (!email || !username || !name || !password) {
      return { success: false, error: "Missing required fields" };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return { success: false, error: "User already exists with this email or username" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        username,
        name,
        passwordHash,
        authProvider: "EMAIL"
      }
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register user" };
  }
}
