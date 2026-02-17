"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { CreateGoalData } from "./types";

export async function createGoal(data: CreateGoalData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const newGoal = await db.financialGoal.create({
      data: {
        userId: session.user.id,
        name: data.name,
        description: data.description,
        targetAmount: data.targetAmount,
        targetDate: data.targetDate,
        category: data.category as any, // Convert string to Prisma enum
        accountId: data.accountId,
      },
    });
    return { success: true, goal: newGoal };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Error while creating a goal." };
  }
}

export async function deleteGoal(id: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await db.financialGoal.delete({
      where: {
        id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Error while deleting a goal." };
  }
}
