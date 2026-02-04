"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { error } from "console";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export async function register(values: z.infer<typeof registerSchema>) {
  try {
    const validatedFiels = registerSchema.safeParse(values);

    if (!validatedFiels.success) {
      return {
        error: "Invalid input",
        details: validatedFiels.error.flatten().fieldErrors,
      };
    }
    const { email, password, firstName, lastName } = validatedFiels.data;

    const existUser = await db.user.findUnique({
      where: { email },
    });

    if (existUser) {
      return {
        error: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    return {
      success: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "Wystąpił błąd podczas tworzenia konta",
    };
  }
}
