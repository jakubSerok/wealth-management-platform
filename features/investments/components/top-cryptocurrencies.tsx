"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  image: string;
}

interface TopCryptocurrenciesProps {
  cryptos: CryptoData[];
  loading: boolean;
  onBuy: (symbol: string, price: number) => void;
}

export function TopCryptocurrencies({ cryptos, loading, onBuy }: TopCryptocurrenciesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cryptocurrencies</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading cryptocurrencies...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptos.map((crypto) => (
              <div key={crypto.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-6 h-6"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {crypto.symbol.toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onBuy(crypto.symbol, crypto.current_price)}
                    >
                      Buy
                    </Button>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  ${crypto.current_price.toFixed(2)}
                </p>
                <Badge
                  variant={
                    crypto.price_change_percentage_24h >= 0 ? "default" : "destructive"
                  }
                >
                  {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                  {crypto.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
