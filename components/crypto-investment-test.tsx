"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getUserAccounts } from "@/features/accounts/queries";

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

export default function CryptoInvestmentTest() {
  const [topCryptos, setTopCryptos] = useState<CryptoData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("cml87u5cw0000xgtvjo5tunke");
  const [accountId, setAccountId] = useState("test-account");
  const [newAsset, setNewAsset] = useState({
    symbol: "",
    quantity: "",
    buyPrice: "",
  });

  const [sellAssetData, setSellAssetData] = useState({
    symbol: "",
    quantity: "",
    sellPrice: "",
  });

  const [transactionForm, setTransactionForm] = useState<TransactionForm>({
    symbol: "",
    quantity: "",
    price: "",
    type: "buy",
    isOpen: false,
  });

  const [userAccounts, setUserAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

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

  const testTransaction = async () => {
    if (!selectedAccount || !userId) {
      alert("Please select account and user ID first");
      return;
    }

    console.log("=== TEST TRANSACTION ===");
    try {
      const response = await fetch("/api/debug/test-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          accountId: selectedAccount,
          symbol: "BTC",
          quantity: 0.001,
          buyPrice: 50000,
        }),
      });

      const result = await response.json();
      console.log("Test transaction result:", result);

      if (result.success) {
        alert(
          `Test Transaction SUCCESS!\nOld Balance: $${result.data.oldBalance}\nNew Balance: $${result.data.newBalance}\nCost: $${result.data.totalCost}`,
        );
        fetchUserAccounts(); // Refresh accounts
      } else {
        alert(`Test Transaction FAILED: ${result.error}`);
      }
    } catch (error) {
      console.error("Test transaction error:", error);
      alert(`Test transaction error: ${error}`);
    }
  };

  const debugAccounts = async () => {
    console.log("=== DEBUG ACCOUNTS ===");
    try {
      const response = await fetch(`/api/debug/accounts?userId=${userId}`);
      const result = await response.json();
      console.log("Debug result:", result);

      if (result.success) {
        console.log("User accounts:", result.data.accounts);
        console.log("Crypto assets:", result.data.cryptoAssets);

        // Show alert with summary
        alert(
          `Debug Info:\nTotal Accounts: ${result.data.totalAccounts}\nTotal Crypto Assets: ${result.data.totalCryptoAssets}\n\nCheck console for details.`,
        );
      } else {
        console.error("Debug failed:", result.error);
        alert(`Debug failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Debug error:", error);
      alert(`Debug error: ${error}`);
    }
  };

  const fetchUserAccounts = async () => {
    try {
      const accounts = await getUserAccounts();
      setUserAccounts(accounts.accounts || []);
      if (accounts.accounts?.length > 0 && !selectedAccount) {
        setSelectedAccount(accounts.accounts[0].id);
        setAccountId(accounts.accounts[0].id);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchPortfolio = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/investments/crypto?action=portfolio&userId=${userId}`,
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
      console.log("Price update result:", result);
      if (result.success) {
        fetchPortfolio(); // Refresh portfolio after price update
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    }
    setLoading(false);
  };

  const buyAsset = async () => {
    if (!newAsset.symbol || !newAsset.quantity || !newAsset.buyPrice) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/investments/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "buy-asset",
          userId,
          accountId: selectedAccount,
          symbol: newAsset.symbol,
          quantity: parseFloat(newAsset.quantity),
          buyPrice: parseFloat(newAsset.buyPrice),
        }),
      });
      const result = await response.json();
      console.log("Buy asset result:", result);

      if (result.success) {
        setNewAsset({ symbol: "", quantity: "", buyPrice: "" });
        fetchUserAccounts(); // Refresh account balance
        fetchPortfolio();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error buying asset:", error);
    }
    setLoading(false);
  };

  const sellCryptoAsset = async () => {
    if (
      !sellAssetData.symbol ||
      !sellAssetData.quantity ||
      !sellAssetData.sellPrice
    ) {
      alert("Please fill all fields");
      return;
    }

    // Sprawdź czy użytkownik ma wystarczającą ilość krypto
    const asset = portfolio?.assets.find(
      (a) => a.symbol.toUpperCase() === sellAssetData.symbol.toUpperCase(),
    );

    if (!asset) {
      alert(
        `You don't have any ${sellAssetData.symbol.toUpperCase()} in your portfolio`,
      );
      return;
    }

    const requestedQuantity = parseFloat(sellAssetData.quantity);
    if (requestedQuantity > asset.quantity) {
      alert(
        `Insufficient ${sellAssetData.symbol.toUpperCase()}. Available: ${asset.quantity}, Requested: ${requestedQuantity}`,
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/investments/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sell-asset",
          userId,
          accountId: selectedAccount,
          symbol: sellAssetData.symbol,
          quantity: parseFloat(sellAssetData.quantity),
          sellPrice: parseFloat(sellAssetData.sellPrice),
        }),
      });
      const result = await response.json();
      console.log("Sell asset result:", result);

      if (result.success) {
        setSellAssetData({ symbol: "", quantity: "", sellPrice: "" });
        fetchUserAccounts(); // Refresh account balance
        fetchPortfolio();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error selling asset:", error);
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
      !selectedAccount
    ) {
      alert("Please fill all fields");
      return;
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
        fetchUserAccounts(); // Refresh account balance
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
    if (selectedAccount) {
      fetchPortfolio();
    }
  }, [selectedAccount]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Crypto Investment Dashboard</h1>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={fetchTopCryptos} disabled={loading}>
              Refresh Top Cryptos
            </Button>
            <Button onClick={updatePrices} disabled={loading}>
              Update All Prices
            </Button>
            <Button onClick={fetchPortfolio} disabled={loading}>
              Refresh Portfolio
            </Button>
            <Button
              onClick={debugAccounts}
              disabled={loading}
              variant="outline"
            >
              Debug Accounts
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">User ID</label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => {
                  setSelectedAccount(e.target.value);
                  setAccountId(e.target.value);
                }}
                className="w-full p-2 border rounded-md"
              >
                {userAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} (${account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Asset */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <Input
              placeholder="Symbol (BTC)"
              value={newAsset.symbol}
              onChange={(e) =>
                setNewAsset({ ...newAsset, symbol: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={newAsset.quantity}
              onChange={(e) =>
                setNewAsset({ ...newAsset, quantity: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Buy Price (USD)"
              value={newAsset.buyPrice}
              onChange={(e) =>
                setNewAsset({ ...newAsset, buyPrice: e.target.value })
              }
            />
            <Button onClick={buyAsset} disabled={loading}>
              Buy Asset
            </Button>
            <Button
              onClick={debugAccounts}
              disabled={loading}
              variant="outline"
            >
              Debug Accounts
            </Button>
            <Button
              onClick={testTransaction}
              disabled={loading}
              variant="destructive"
            >
              Test Transaction
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      {portfolio && (
        <Card>
          <CardHeader>
            <CardTitle>
              Account Balance: ${portfolio.accountBalance.toFixed(2)} |
              Portfolio Value: ${portfolio.totalValue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.assets.map((asset) => (
                <div key={asset.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{asset.symbol}</h3>
                      <p className="text-sm text-gray-600">{asset.name}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openTransactionForm(
                            "buy",
                            asset.symbol,
                            asset.currentPrice,
                          )
                        }
                        disabled={loading}
                      >
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openTransactionForm(
                            "sell",
                            asset.symbol,
                            asset.currentPrice,
                          )
                        }
                        disabled={loading}
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
          </CardContent>
        </Card>
      )}

      {/* Sell Asset */}
      <Card>
        <CardHeader>
          <CardTitle>Sell Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <Input
              placeholder="Symbol (BTC)"
              value={sellAssetData.symbol}
              onChange={(e) =>
                setSellAssetData({ ...sellAssetData, symbol: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={sellAssetData.quantity}
              onChange={(e) =>
                setSellAssetData({ ...sellAssetData, quantity: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Sell Price (USD)"
              value={sellAssetData.sellPrice}
              onChange={(e) =>
                setSellAssetData({
                  ...sellAssetData,
                  sellPrice: e.target.value,
                })
              }
            />
            <Button onClick={sellCryptoAsset} disabled={loading}>
              Sell Asset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      {transactionForm.isOpen && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CardContent className="bg-white p-6 rounded-lg w-96">
            <CardHeader className="p-0 mb-4">
              <CardTitle>
                {transactionForm.type === "buy" ? "Buy" : "Sell"}{" "}
                {transactionForm.symbol}
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={transactionForm.quantity}
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {transactionForm.type === "buy" ? "Buy Price" : "Sell Price"}{" "}
                  (USD)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={transactionForm.price}
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      price: e.target.value,
                    })
                  }
                />
              </div>
              {transactionForm.quantity && transactionForm.price && (
                <div className="p-3 bg-gray-100 rounded">
                  <p className="text-sm font-medium">
                    Total: $
                    {(
                      parseFloat(transactionForm.quantity) *
                      parseFloat(transactionForm.price)
                    ).toFixed(2)}
                  </p>
                  {transactionForm.type === "sell" &&
                    (() => {
                      const asset = portfolio?.assets.find(
                        (a) =>
                          a.symbol.toUpperCase() ===
                          transactionForm.symbol.toUpperCase(),
                      );
                      const requestedQuantity = parseFloat(
                        transactionForm.quantity,
                      );
                      const availableQuantity = asset?.quantity || 0;
                      const isValid = requestedQuantity <= availableQuantity;

                      return (
                        <p
                          className={`text-xs mt-1 ${isValid ? "text-green-600" : "text-red-600"}`}
                        >
                          Available: {availableQuantity}{" "}
                          {transactionForm.symbol}
                          {!isValid &&
                            ` - Requested: ${requestedQuantity} (Too much!)`}
                        </p>
                      );
                    })()}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={executeTransaction}
                  disabled={loading}
                  className="flex-1"
                >
                  {transactionForm.type === "buy" ? "Buy" : "Sell"}
                </Button>
                <Button
                  onClick={closeTransactionForm}
                  variant="outline"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Cryptocurrencies */}
      <Card>
        <CardHeader>
          <CardTitle>Top Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCryptos.map((crypto) => (
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
                      onClick={() =>
                        openTransactionForm(
                          "buy",
                          crypto.symbol,
                          crypto.current_price,
                        )
                      }
                      disabled={loading}
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
                    crypto.price_change_percentage_24h >= 0
                      ? "default"
                      : "destructive"
                  }
                >
                  {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                  {crypto.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
