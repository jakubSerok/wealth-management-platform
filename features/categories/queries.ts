"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function getUserCategories() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const categories = await db.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });

    return categories;
  } catch (error) {
    console.error("Query Error:", error);
    return [];
  }
}
