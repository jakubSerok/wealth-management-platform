"use server";

import { db } from "@/lib/db";

export async function getUserAccounts(userId: string) {
  const account = db.user.findUnique({
    where: { id: userId },
    include: {
      accounts: true,
    },
  });

  if (!account) {
    throw new Error("User not found");
  }

  return account;
}
