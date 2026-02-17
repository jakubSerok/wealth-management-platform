"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransactionForm {
  symbol: string;
  quantity: string;
  price: string;
  type: "buy" | "sell";
  isOpen: boolean;
}

interface PortfolioAsset {
  symbol: string;
  quantity: number;
}

interface PortfolioData {
  assets: PortfolioAsset[];
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: TransactionForm;
  onFormChange: (form: TransactionForm) => void;
  onExecute: () => void;
  loading: boolean;
  portfolio: PortfolioData | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  form,
  onFormChange,
  onExecute,
  loading,
  portfolio,
}: TransactionModalProps) {
  if (!isOpen) return null;

  const handleQuantityChange = (value: string) => {
    onFormChange({ ...form, quantity: value });
  };

  const handlePriceChange = (value: string) => {
    onFormChange({ ...form, price: value });
  };

  const asset = portfolio?.assets.find(
    (a) => a.symbol.toUpperCase() === form.symbol.toUpperCase(),
  );
  const requestedQuantity = parseFloat(form.quantity);
  const availableQuantity = asset?.quantity || 0;
  const isValid = requestedQuantity <= availableQuantity;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {form.type === "buy" ? "Buy" : "Sell"} {form.symbol}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Symbol</label>
            <Input value={form.symbol} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              value={form.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="0.00"
              type="number"
              step="0.00000001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (USD)
            </label>
            <Input
              value={form.price}
              disabled={true}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0.00"
              type="number"
              step="0.01"
            />
          </div>
          {form.quantity && form.price && (
            <div className="p-3 bg-gray-100 rounded">
              <p className="text-sm font-medium">
                Total: $
                {(parseFloat(form.quantity) * parseFloat(form.price)).toFixed(
                  2,
                )}
              </p>
              {form.type === "sell" && (
                <p
                  className={`text-xs mt-1 ${isValid ? "text-green-600" : "text-red-600"}`}
                >
                  Available: {availableQuantity} {form.symbol}
                  {!isValid && ` - Requested: ${requestedQuantity} (Too much!)`}
                </p>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={onExecute} disabled={loading} className="flex-1">
              {form.type === "buy" ? "Buy" : "Sell"}
            </Button>
            <Button onClick={onClose} variant="outline" disabled={loading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
