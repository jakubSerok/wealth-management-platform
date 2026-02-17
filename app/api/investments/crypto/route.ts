import { NextRequest, NextResponse } from "next/server";
import {
  getPortfolioValue,
  getPortfolioForAccount,
  buyCryptoAsset,
  sellCryptoAsset,
  updateCryptoPrices,
} from "@/lib/fetch-prices";
import { getTopCryptocurrencies } from "@/features/investments/api/coingecko";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const action = searchParams.get("action");

  try {
    if (action === "top") {
      const limit = parseInt(searchParams.get("limit") || "10");
      const data = await getTopCryptocurrencies(limit);
      return NextResponse.json({ success: true, data });
    }

    if (action === "portfolio") {
      const userId = searchParams.get("userId");
      const accountId = searchParams.get("accountId");

      if (!userId) {
        return NextResponse.json(
          { success: false, error: "User ID required" },
          { status: 400 },
        );
      }

      try {
        let result;
        if (accountId) {
          result = await getPortfolioForAccount(userId, accountId);
        } else {
          result = await getPortfolioValue(userId);
        }

        return NextResponse.json({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        return NextResponse.json(
          { success: false, error: "Failed to fetch portfolio" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "update-prices") {
      const result = await updateCryptoPrices();
      return NextResponse.json({ success: true, data: result });
    }

    if (action === "buy-asset") {
      const { userId, accountId, symbol, quantity, buyPrice } = body;

      console.log("API: Buy asset request:", {
        userId,
        accountId,
        symbol,
        quantity,
        buyPrice,
      });

      if (!userId || !accountId || !symbol || !quantity || !buyPrice) {
        console.log("API: Missing fields");
        return NextResponse.json(
          { success: false, error: "Missing fields" },
          { status: 400 },
        );
      }

      try {
        const result = await buyCryptoAsset(
          userId,
          accountId,
          symbol,
          quantity,
          buyPrice,
        );

        console.log("API: Buy asset result:", result);

        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error },
            { status: 400 },
          );
        }

        return NextResponse.json({
          success: true,
          message: "Asset purchased successfully",
        });
      } catch (error) {
        console.error("API: Buy asset error:", error);
        return NextResponse.json(
          { success: false, error: `API Error: ${error}` },
          { status: 500 },
        );
      }
    }

    if (action === "sell-asset") {
      const { userId, accountId, symbol, quantity, sellPrice } = body;

      if (!userId || !accountId || !symbol || !quantity || !sellPrice) {
        return NextResponse.json(
          { success: false, error: "Missing fields" },
          { status: 400 },
        );
      }

      const result = await sellCryptoAsset(
        userId,
        accountId,
        symbol,
        quantity,
        sellPrice,
      );

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Asset sold successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
