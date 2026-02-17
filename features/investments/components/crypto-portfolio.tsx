"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  value: number;
  avgBuyPrice: number;
}

interface PortfolioData {
  totalValue: number;
  accountBalance: number;
  assets: PortfolioAsset[];
}

interface CryptoPortfolioProps {
  portfolio: PortfolioData;
  onBuy: (symbol: string, price: number) => void;
  onSell: (symbol: string, price: number) => void;
}

export function CryptoPortfolio({ portfolio, onBuy, onSell }: CryptoPortfolioProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Portfolio Balance: ${portfolio.accountBalance.toFixed(2)} | 
          Total Value: ${portfolio.totalValue.toFixed(2)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {portfolio.assets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No crypto assets in your portfolio. Start by buying some cryptocurrencies below.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.assets.map((asset) => (
              <div key={asset.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{asset.symbol}</h3>
                    <p className="text-sm text-gray-600">{asset.name}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onBuy(asset.symbol, asset.currentPrice)}
                    >
                      Buy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSell(asset.symbol, asset.currentPrice)}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Quantity: {asset.quantity}</p>
                  <p>Current Price: ${asset.currentPrice.toFixed(2)}</p>
                  <p>Avg Buy Price: ${asset.avgBuyPrice.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    P&L: $
                    {(
                      (asset.currentPrice - asset.avgBuyPrice) *
                      asset.quantity
                    ).toFixed(2)}{" "}
                    <span
                      className={
                        (asset.currentPrice - asset.avgBuyPrice) *
                          asset.quantity >=
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      (
                      {(
                        ((asset.currentPrice - asset.avgBuyPrice) /
                          asset.avgBuyPrice) *
                        100
                      ).toFixed(2)}
                      %)
                    </span>
                  </p>
                  <p className="font-semibold text-green-600">
                    Value: ${asset.value.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
