"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getUserAccounts } from "@/features/accounts/queries";
import { CryptoPortfolio } from "./crypto-portfolio";
import { TopCryptocurrencies } from "./top-cryptocurrencies";
import { TransactionModal } from "./transaction-modal";
import { AccountSelector } from "./account-selector";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  image: string;
}

interface PortfolioData {
  totalValue: number;
  accountBalance: number;
  assets: Array<{
    id: string;
    symbol: string;
    name: string;
    quantity: number;
    currentPrice: number;
    value: number;
    avgBuyPrice: number;
  }>;
}

interface TransactionForm {
  symbol: string;
  quantity: string;
  price: string;
  type: "buy" | "sell";
  isOpen: boolean;
}

export default function InvestmentsPage() {
  const [topCryptos, setTopCryptos] = useState<CryptoData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [userAccounts, setUserAccounts] = useState<any[]>([]);
  const [transactionForm, setTransactionForm] = useState<TransactionForm>({
    symbol: "",
    quantity: "",
    price: "",
    type: "buy",
    isOpen: false,
  });

  const fetchTopCryptos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/investments/crypto?action=top&limit=10",
      );
      const result = await response.json();
      if (result.success) {
        setTopCryptos(result.data);
      }
    } catch (error) {
      console.error("Error fetching top cryptos:", error);
    }
    setLoading(false);
  };

  const fetchUserAccounts = async () => {
    try {
      const accounts = await getUserAccounts();
      setUserAccounts(accounts.accounts || []);
      if (accounts.accounts?.length > 0 && !selectedAccount) {
        setSelectedAccount(accounts.accounts[0].id);
        setUserId(accounts.accounts[0].userId);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchPortfolio = async () => {
    if (!selectedAccount || !userId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/investments/crypto?action=portfolio&userId=${userId}&accountId=${selectedAccount}`,
      );
      const result = await response.json();
      if (result.success) {
        setPortfolio(result.data);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
    setLoading(false);
  };

  const updatePrices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/investments/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-prices" }),
      });
      const result = await response.json();
      if (result.success) {
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    }
    setLoading(false);
  };

  const openTransactionForm = (
    type: "buy" | "sell",
    symbol: string,
    currentPrice: number,
  ) => {
    const asset = portfolio?.assets.find(
      (a) => a.symbol.toUpperCase() === symbol.toUpperCase(),
    );

    setTransactionForm({
      symbol,
      quantity: type === "sell" ? asset?.quantity.toString() || "" : "",
      price: currentPrice.toString(),
      type,
      isOpen: true,
    });
  };

  const closeTransactionForm = () => {
    setTransactionForm({
      symbol: "",
      quantity: "",
      price: "",
      type: "buy",
      isOpen: false,
    });
  };

  const executeTransaction = async () => {
    if (
      !transactionForm.symbol ||
      !transactionForm.quantity ||
      !transactionForm.price ||
      !selectedAccount ||
      !userId
    ) {
      alert("Please fill all fields");
      return;
    }

    if (transactionForm.type === "sell") {
      const asset = portfolio?.assets.find(
        (a) => a.symbol.toUpperCase() === transactionForm.symbol.toUpperCase(),
      );

      if (!asset) {
        alert(
          `You don't have any ${transactionForm.symbol.toUpperCase()} in your portfolio`,
        );
        return;
      }

      const requestedQuantity = parseFloat(transactionForm.quantity);
      if (requestedQuantity > asset.quantity) {
        alert(
          `Insufficient ${transactionForm.symbol.toUpperCase()}. Available: ${asset.quantity}, Requested: ${requestedQuantity}`,
        );
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch("/api/investments/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: transactionForm.type === "buy" ? "buy-asset" : "sell-asset",
          userId,
          accountId: selectedAccount,
          symbol: transactionForm.symbol,
          quantity: parseFloat(transactionForm.quantity),
          [transactionForm.type === "buy" ? "buyPrice" : "sellPrice"]:
            parseFloat(transactionForm.price),
        }),
      });
      const result = await response.json();
      console.log(`${transactionForm.type} result:`, result);

      if (result.success) {
        closeTransactionForm();
        fetchUserAccounts();
        fetchPortfolio();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(`Error ${transactionForm.type} asset:`, error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserAccounts();
    fetchTopCryptos();
  }, []);

  useEffect(() => {
    if (selectedAccount && userId) {
      fetchPortfolio();
    }
  }, [selectedAccount, userId]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Investments</h1>
        <div className="flex gap-2">
          <Button onClick={updatePrices} disabled={loading} variant="outline">
            Update Prices
          </Button>
          <Button onClick={fetchPortfolio} disabled={loading} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <AccountSelector
        userAccounts={userAccounts}
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
      />

      {portfolio && (
        <CryptoPortfolio
          portfolio={portfolio}
          onBuy={(symbol: string, price: number) =>
            openTransactionForm("buy", symbol, price)
          }
          onSell={(symbol: string, price: number) =>
            openTransactionForm("sell", symbol, price)
          }
        />
      )}

      <TopCryptocurrencies
        cryptos={topCryptos}
        loading={loading}
        onBuy={(symbol: string, price: number) =>
          openTransactionForm("buy", symbol, price)
        }
      />

      <TransactionModal
        isOpen={transactionForm.isOpen}
        onClose={closeTransactionForm}
        form={transactionForm}
        onFormChange={setTransactionForm}
        onExecute={executeTransaction}
        loading={loading}
        portfolio={portfolio}
      />
    </div>
  );
}
