import { auth } from "@/auth";
import {TransactionFilters} from "./types"
import {getTransactionsFromDb} from "@/lib/transaction-operations"


export async function getTransactionsQuery(filters: TransactionFilters = {}) {
    const session = await auth()
    if (!session) {
        throw new Error("Unauthorized");
    }
    try{
const transactions = await getTransactionsFromDb(session.user.id, filters);
return transactions;

    }
    catch (error) {
    console.error("Query Error:", error);
    return [];
  }
}