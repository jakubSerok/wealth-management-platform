import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get all user accounts
    const accounts = await db.account.findMany({
      where: { userId },
      include: {
        assets: true,
        transactions: {
          orderBy: { date: 'desc' },
          take: 5
        }
      }
    });

    // Get all crypto assets
    const cryptoAssets = await db.asset.findMany({
      where: { 
        type: 'CRYPTO',
        account: { userId }
      },
      include: {
        account: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        accounts,
        cryptoAssets,
        totalAccounts: accounts.length,
        totalCryptoAssets: cryptoAssets.length
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { success: false, error: `Debug error: ${error}` },
      { status: 500 }
    );
  }
}
