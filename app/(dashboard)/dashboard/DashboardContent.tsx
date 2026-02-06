"use client";

import { useState } from "react";
import { AccountCard } from "@/features/accounts/components/AccountCard";
import { AddAccountCard } from "@/features/accounts/components/AddAccountCard";
import { AddNewCard } from "@/features/accounts/components/AddNewCard";
import { Button } from "@/components/ui/button";

interface DashboardContentProps {
  session: any;
  userData: any;
}

export function DashboardContent({ session, userData }: DashboardContentProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAccountCreated = () => {
    setRefreshKey(prev => prev + 1);
    // In a real app, you'd want to refetch the data here
    // For now, we'll just trigger a re-render
    window.location.reload();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Hello, {session.user.firstName}!</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your accounts</h2>

        {userData.accounts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              You don't have any accounts
            </h3>
            <p className="text-gray-600 mb-4">
              Add your first account to start managing your finances
            </p>
            <AddNewCard onAccountCreated={handleAccountCreated}>
              <Button>Add first account</Button>
            </AddNewCard>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.accounts.map((account: any) => (
              <AccountCard key={account.id} account={account} />
            ))}
            <AddAccountCard onAccountCreated={handleAccountCreated} />
          </div>
        )}
      </div>
    </div>
  );
}
