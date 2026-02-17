"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

interface AccountSelectorProps {
  userAccounts: Account[];
  selectedAccount: string;
  onAccountChange: (accountId: string) => void;
}

export function AccountSelector({
  userAccounts,
  selectedAccount,
  onAccountChange,
}: AccountSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <select
          value={selectedAccount}
          onChange={(e) => onAccountChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {userAccounts.map((account) => {
            return (
              <option key={account.id} value={account.id}>
                {account.name} (${account.balance.toFixed(2)}) - {account.type}
              </option>
            );
          })}
        </select>
      </CardContent>
    </Card>
  );
}
