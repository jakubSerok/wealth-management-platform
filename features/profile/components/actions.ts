"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

import bcrypt from "bcryptjs";

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export async function updateProfile(data: ProfileData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("No session exists");
    }

    const updateData: any = {};

    if (data.firstName !== undefined) {
      updateData.firstName = data.firstName;
    }

    if (data.lastName !== undefined) {
      updateData.lastName = data.lastName;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.newPassword && data.currentPassword) {
      const currentUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        data.currentPassword,
        currentUser.password,
      );

      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      const hashedNewPassword = await bcrypt.hash(data.newPassword, 12);
      updateData.password = hashedNewPassword;
    }

    const user = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
