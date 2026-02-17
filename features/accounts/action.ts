"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

enum AccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  CREDIT_CARD = "CREDIT_CARD",
  INVESTMENT = "INVESTMENT",
  CASH = "CASH",
}

interface AccountData {
  name: string;
  type: AccountType;
  currency: string;
}

export async function addAccount(values: AccountData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("No session exists");
    }
    const { name, type, currency } = values;

    if (!name) {
      throw new Error("Account name is required");
    }

    const account = await db.account.create({
      data: {
        userId: session.user.id,
        name,
        type: type as any, // Convert to Prisma enum
        currency: currency || "PLN",
        balance: 0,
      },
    });

    return { success: true, account };
  } catch (error) {
    console.error("Failed to create account:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create account",
    );
  }
}
