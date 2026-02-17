import { CoinGeckoCoin } from "../types";

const API_KEY = process.env.COINGECKO_API_KEY;
const BASE_URL = "https://api.coingecko.com/api/v3";

async function fetchCoinGecko(endpoint: string) {
  const url = `${BASE_URL}${endpoint}`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": API_KEY || "",
    },
    next: { revalidate: 60 },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `CoinGecko API Error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export async function getCryptocurrenciesByIds(
  ids: string[],
): Promise<CoinGeckoCoin[]> {
  if (ids.length === 0) return [];

  try {
    const idsString = ids.join(",");
    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&ids=${idsString}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
    );
    return data;
  } catch (error) {
    console.error("Error fetching cryptocurrencies by IDs:", error);
    return [];
  }
}

export async function getTopCryptocurrencies(
  limit: number = 50,
): Promise<CoinGeckoCoin[]> {
  try {
    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
    );
    return data;
  } catch (error) {
    console.error("Error fetching top cryptocurrencies:", error);
    return [];
  }
}

export async function getCryptocurrencyById(
  id: string,
): Promise<CoinGeckoCoin | null> {
  try {
    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`,
    );
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching cryptocurrency ${id}:`, error);
    return null;
  }
}
