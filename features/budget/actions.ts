"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateBudgetData } from "./types";

export async function createBudgetAction(data: CreateBudgetData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    const newBudget = await db.budget.create({
      data: {
        userId: session.user.id,
        name: data.name,
        amount: data.amount,
        period: data.period,
        startDate: data.startDate,
        endDate: data.endDate,
        accountId: data.accountId || undefined,
        categoryId: data.categoryId || undefined,
      },
    });
    return { success: true, budget: newBudget };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Error while creating a budget." };
  }
}
