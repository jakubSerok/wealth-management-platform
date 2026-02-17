import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, accountId, symbol, quantity, buyPrice } = body;

    console.log('TEST: Direct transaction attempt');
    console.log('TEST: Parameters:', { userId, accountId, symbol, quantity, buyPrice });

    const totalCost = quantity * buyPrice;

    // Find account
    const account = await db.account.findUnique({
      where: { id: accountId, userId },
      include: { assets: true }
    });

    if (!account) {
      console.log('TEST: Account not found');
      return NextResponse.json({ success: false, error: 'Account not found' });
    }

    console.log('TEST: Account found:', {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: Number(account.balance),
      required: totalCost
    });

    const currentBalance = Number(account.balance);
    if (currentBalance < totalCost) {
      console.log('TEST: Insufficient funds');
      return NextResponse.json({ 
        success: false, 
        error: `Insufficient funds. Required: $${totalCost}, Available: $${currentBalance}` 
      });
    }

    // Try to update balance directly
    console.log('TEST: Attempting balance update...');
    const updatedAccount = await db.account.update({
      where: { id: accountId },
      data: {
        balance: {
          decrement: totalCost
        }
      }
    });

    console.log('TEST: Balance updated successfully:', {
      oldBalance: currentBalance,
      newBalance: Number(updatedAccount.balance),
      decrement: totalCost
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test transaction completed',
      data: {
        oldBalance: currentBalance,
        newBalance: Number(updatedAccount.balance),
        totalCost
      }
    });

  } catch (error) {
    console.error('TEST: Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Test error: ${error}` 
    });
  }
}
