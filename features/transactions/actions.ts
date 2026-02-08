"use server";

import { auth } from "@/auth";
import { createTransactionWithBalance } from "@/lib/transaction-operations";
import {CreateTransactionData} from "./types"

export async function createTransactionAction(data:CreateTransactionData) {
    const session = await auth()
    if (!session) {
        throw new Error("Unauthorized");
    }

    if(data.amount<0){
        throw new Error("Amount must be positive");
    }
    try{
        await createTransactionWithBalance({
            ...data
        })
        return {success:true}
    }

   catch (error) {
    console.error("Database Error:", error);
    return { error: "Wystąpił błąd podczas zapisywania transakcji." };
  }
}
