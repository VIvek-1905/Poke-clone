"use server";

import { prisma } from "@poke-clone/db";
import { cookies } from "next/headers";

export async function authenticateTrainer(username: string, securityKey: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          password: securityKey, 
          eloRating: 1000,
        },
      });
      
      // Give the user a secure session cookie
      (await cookies()).set("trainer-session", user.username, { secure: true });
      return { success: true, isNew: true, user };
    }

    if (user.password !== securityKey) {
      return { success: false, error: "Invalid Security Key." };
    }

    // Give the user a secure session cookie
    (await cookies()).set("trainer-session", user.username, { secure: true });
    return { success: true, isNew: false, user };

  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Internal server error." };
  }
}