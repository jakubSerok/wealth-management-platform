import { db } from "@/lib/db";
import { getCryptocurrenciesByIds } from "@/features/investments/api/coingecko";
import { CoinGeckoCoin } from "@/features/investments/types";
import { auth } from "@/auth";

export interface PriceUpdateResult {
  success: boolean;
  updatedAssets: number;
  errors: string[];
}

function coinGeckoToAssetUpdate(coin: CoinGeckoCoin) {
  return {
    symbol: coin.symbol.toUpperCase(),
    currentPrice: coin.current_price,
    lastUpdated: new Date(),
  };
}

export async function updateCryptoPrices(): Promise<PriceUpdateResult> {
  const result: PriceUpdateResult = {
    success: true,
    updatedAssets: 0,
    errors: [],
  };

  try {
    const uniqueAssets = await db.asset.groupBy({
      by: ["symbol"],
      where: {
        type: "CRYPTO",
      },
    });

    if (uniqueAssets.length === 0) {
      console.log("No crypto assets found to update.");
      return result;
    }

    const symbolsIds = uniqueAssets.map((asset) =>
      getCoinGeckoId(asset.symbol),
    );

    const cryptoPrices = await getCryptocurrenciesByIds(symbolsIds);

    if (cryptoPrices.length === 0) {
      result.errors.push(
        "API returned no data. Check if symbols match CoinGecko IDs.",
      );
      return result;
    }

    for (const coin of cryptoPrices) {
      try {
        const updateData = coinGeckoToAssetUpdate(coin);

        await db.asset.updateMany({
          where: {
            symbol: { equals: updateData.symbol, mode: "insensitive" },
            type: "CRYPTO",
          },
          data: {
            currentPrice: updateData.currentPrice,
            lastUpdated: updateData.lastUpdated,
          },
        });

        const assetsToUpdateHistory = await db.asset.findMany({
          where: { symbol: { equals: updateData.symbol, mode: "insensitive" } },
        });

        for (const asset of assetsToUpdateHistory) {
          await db.assetPriceHistory.create({
            data: {
              assetId: asset.id,
              price: updateData.currentPrice,
              date: updateData.lastUpdated,
            },
          });
        }

        result.updatedAssets++;
      } catch (err) {
        console.error(`Failed to update ${coin.symbol}`, err);
        result.errors.push(`Failed to update ${coin.symbol}`);
      }
    }
  } catch (error) {
    console.error("Critical error in updateCryptoPrices:", error);
    result.success = false;
    result.errors.push("Database connection failed");
  }

  return result;
}

export async function getPortfolioValue(userId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Get all user accounts (not just investment)
  const accounts = await db.account.findMany({
    where: {
      userId,
    },
    include: {
      assets: {
        where: { type: "CRYPTO" },
      },
    },
  });

  if (accounts.length === 0) {
    return {
      totalValue: 0,
      accountBalance: 0,
      assets: [],
    };
  }

  // Use the first account that has crypto assets, or the first account
  const account = accounts.find((acc) => acc.assets.length > 0) || accounts[0];

  let totalValue = 0;
  const enrichedAssets = account.assets.map((asset) => {
    const price = Number(asset.currentPrice) || 0;
    const qty = Number(asset.quantity) || 0;
    const value = price * qty;

    totalValue += value;

    return {
      ...asset,
      value,
      currentPrice: price,
      quantity: qty,
      avgBuyPrice: Number(asset.avgBuyPrice) || 0,
    };
  });

  return {
    totalValue,
    accountBalance: Number(account.balance) || 0,
    assets: enrichedAssets,
  };
}

const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  MATIC: "polygon-ecosystem-token",
  LINK: "chainlink",
  UNI: "uniswap",
  ATOM: "cosmos",
  LTC: "litecoin",
  BUSD: "binance-usd",
  DAI: "dai",
  WBTC: "wrapped-bitcoin",
  WETH: "weth",
  SHIB: "shiba-inu",
  TRX: "tron",
  FTM: "fantom",
  NEAR: "near",
  ALGO: "algorand",
  VET: "vechain",
  THETA: "theta-token",
  FIL: "filecoin",
  AAVE: "aave",
  MKR: "maker",
  COMP: "compound-governance-token",
  SUSHI: "sushi",
  CRV: "curve-dao-token",
  YFI: "yearn-finance",
  "1INCH": "1inch",
  ENJ: "enjincoin",
  MANA: "decentraland",
  SAND: "the-sandbox",
  AXS: "axie-infinity",
  GALA: "gala",
};

function getCoinGeckoId(symbol: string): string {
  const upperSymbol = symbol.toUpperCase();
  return SYMBOL_TO_COINGECKO_ID[upperSymbol] || symbol.toLowerCase();
}

export async function getPortfolioForAccount(
  userId: string,
  accountId: string,
) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Get specific account
  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId,
    },
    include: {
      assets: {
        where: { type: "CRYPTO" },
      },
    },
  });

  if (!account) {
    return {
      totalValue: 0,
      accountBalance: 0,
      assets: [],
    };
  }

  let totalValue = 0;
  const enrichedAssets = account.assets.map((asset) => {
    const price = Number(asset.currentPrice) || 0;
    const qty = Number(asset.quantity) || 0;
    const value = price * qty;

    totalValue += value;

    return {
      ...asset,
      value,
      currentPrice: price,
      quantity: qty,
      avgBuyPrice: Number(asset.avgBuyPrice) || 0,
    };
  });

  return {
    totalValue,
    accountBalance: Number(account.balance) || 0,
    assets: enrichedAssets,
  };
}

export async function getCurrentPrices(
  symbols: string[],
): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>();

  try {
    const coinGeckoIds = symbols.map((symbol) => getCoinGeckoId(symbol));

    const cryptoPrices = await getCryptocurrenciesByIds(coinGeckoIds);

    for (const coin of cryptoPrices) {
      priceMap.set(coin.symbol.toUpperCase(), coin.current_price);
    }
  } catch (error) {
    console.error("Error fetching current prices:", error);
  }

  return priceMap;
}

export async function addCryptoAsset(
  accountId: string,
  symbol: string,
  quantity: number,
  buyPrice: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentPrices = await getCurrentPrices([symbol.toLowerCase()]);
    const currentPrice = currentPrices.get(symbol.toUpperCase());

    if (!currentPrice) {
      return {
        success: false,
        error: `Could not fetch current price for ${symbol}`,
      };
    }

    const existingAsset = await db.asset.findUnique({
      where: {
        accountId_symbol: {
          accountId,
          symbol: symbol.toUpperCase(),
        },
      },
    });

    if (existingAsset) {
      const currentQuantity = Number(existingAsset.quantity);
      const currentAvgPrice = Number(existingAsset.avgBuyPrice);
      const newQuantity = currentQuantity + quantity;
      const newAvgPrice =
        (currentQuantity * currentAvgPrice + quantity * buyPrice) / newQuantity;

      await db.asset.update({
        where: {
          id: existingAsset.id,
        },
        data: {
          quantity: newQuantity,
          avgBuyPrice: newAvgPrice,
          currentPrice,
          lastUpdated: new Date(),
        },
      });
    } else {
      await db.asset.create({
        data: {
          accountId,
          symbol: symbol.toUpperCase(),
          name: symbol.toUpperCase(),
          type: "CRYPTO",
          quantity,
          avgBuyPrice: buyPrice,
          currentPrice,
          currency: "USD",
          buyDate: new Date(),
          lastUpdated: new Date(),
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding crypto asset:", error);
    return { success: false, error: `Database error: ${error}` };
  }
}

export async function buyCryptoAsset(
  userId: string,
  accountId: string,
  symbol: string,
  quantity: number,
  buyPrice: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("buyCryptoAsset: Starting with userId:", userId);

    const session = await auth();
    console.log("buyCryptoAsset: Auth session:", session);

    if (!session) {
      console.log("buyCryptoAsset: No session found");
      return { success: false, error: "No session found" };
    }

    if (session.user.id !== userId) {
      console.log(
        "buyCryptoAsset: User ID mismatch. Session:",
        session.user.id,
        "Request:",
        userId,
      );
      return { success: false, error: "User ID mismatch" };
    }

    const totalCost = quantity * buyPrice;
    console.log(`Buying ${quantity} ${symbol} at $${buyPrice} = $${totalCost}`);

    const account = await db.account.findUnique({
      where: { id: accountId, userId },
      include: { assets: true },
    });

    console.log("Account found:", account ? "YES" : "NO");
    if (account) {
      console.log("Account type:", account.type);
      console.log("Current balance:", Number(account.balance));
    }

    if (!account) {
      return { success: false, error: "Account not found" };
    }

    const currentBalance = Number(account.balance);
    if (currentBalance < totalCost) {
      return {
        success: false,
        error: `Insufficient funds. Required: $${totalCost}, Available: $${currentBalance}`,
      };
    }

    const currentPrices = await getCurrentPrices([symbol]);
    const currentPrice = currentPrices.get(symbol.toUpperCase());

    if (!currentPrice) {
      return {
        success: false,
        error: `Could not fetch current price for ${symbol}`,
      };
    }

    console.log("Starting transaction...");
    await db.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: totalCost,
          },
        },
      });

      console.log("Balance updated");

      await tx.transaction.create({
        data: {
          accountId,
          amount: totalCost,
          type: "INVESTMENT",
          description: `Purchase of ${quantity} ${symbol.toUpperCase()} at $${buyPrice}`,
          date: new Date(),
        },
      });

      console.log("Transaction created");

      const existingAsset = account.assets.find(
        (asset) => asset.symbol.toUpperCase() === symbol.toUpperCase(),
      );

      if (existingAsset) {
        const currentQuantity = Number(existingAsset.quantity);
        const currentAvgPrice = Number(existingAsset.avgBuyPrice);
        const newQuantity = currentQuantity + quantity;
        const newAvgPrice =
          (currentQuantity * currentAvgPrice + quantity * buyPrice) /
          newQuantity;

        await tx.asset.update({
          where: { id: existingAsset.id },
          data: {
            quantity: newQuantity,
            avgBuyPrice: newAvgPrice,
            currentPrice,
            lastUpdated: new Date(),
          },
        });

        console.log("Asset updated");
      } else {
        await tx.asset.create({
          data: {
            accountId,
            symbol: symbol.toUpperCase(),
            name: symbol.toUpperCase(),
            type: "CRYPTO",
            quantity,
            avgBuyPrice: buyPrice,
            currentPrice,
            currency: "USD",
            buyDate: new Date(),
            lastUpdated: new Date(),
          },
        });

        console.log("New asset created");
      }
    });

    console.log("Transaction completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Error buying crypto asset:", error);
    return { success: false, error: `Transaction failed: ${error}` };
  }
}

// Sell crypto asset
export async function sellCryptoAsset(
  userId: string,
  accountId: string,
  symbol: string,
  quantity: number,
  sellPrice: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session || session.user.id !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const totalRevenue = quantity * sellPrice;

    const asset = await db.asset.findFirst({
      where: {
        accountId,
        symbol: { equals: symbol.toUpperCase(), mode: "insensitive" },
        type: "CRYPTO",
      },
    });

    if (!asset) {
      return { success: false, error: "Asset not found" };
    }

    const currentQuantity = Number(asset.quantity);
    if (currentQuantity < quantity) {
      return { success: false, error: "Insufficient crypto balance" };
    }

    const currentPrices = await getCurrentPrices([symbol]);
    const currentPrice = currentPrices.get(symbol.toUpperCase()) || sellPrice;

    await db.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: totalRevenue,
          },
        },
      });

      await tx.transaction.create({
        data: {
          accountId,
          amount: totalRevenue,
          type: "INVESTMENT",
          description: `Sale of ${quantity} ${symbol.toUpperCase()} at $${sellPrice}`,
          date: new Date(),
        },
      });

      if (currentQuantity === quantity) {
        await tx.asset.delete({
          where: { id: asset.id },
        });
      } else {
        await tx.asset.update({
          where: { id: asset.id },
          data: {
            quantity: {
              decrement: quantity,
            },
            currentPrice: sellPrice,
            lastUpdated: new Date(),
          },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error selling crypto asset:", error);
    return { success: false, error: `Transaction failed: ${error}` };
  }
}
