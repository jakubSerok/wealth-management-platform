"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function getUserAccounts() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...user,
      accounts: user.accounts.map((account) => ({
        ...account,
        balance: Number(account.balance),
      })),
    };
  } catch (error) {
    console.error("Query Error:", error);
    return { accounts: [] };
  }
}
