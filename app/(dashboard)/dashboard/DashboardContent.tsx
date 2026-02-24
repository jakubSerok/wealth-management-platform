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
    setRefreshKey((prev) => prev + 1);
    // In a real app, you'd want to refetch the data here
    // For now, we'll just trigger a re-render
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-2 animate-slideDown">
            Welcome back, {session.user.firstName}!
          </h1>
          <p className="text-blue-100 dark:text-blue-200 text-lg animate-slideUp">
            Here's what's happening with your finances today
          </p>
        </div>
      </div>

      {/* Accounts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Your Accounts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {userData.accounts.length > 0
                ? `You have ${userData.accounts.length} account${userData.accounts.length > 1 ? "s" : ""} connected`
                : "Connect your first account to get started"}
            </p>
          </div>
          {userData.accounts.length > 0 && (
            <AddNewCard onAccountCreated={handleAccountCreated}>
              <Button className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                Add Account
              </Button>
            </AddNewCard>
          )}
        </div>

        {userData.accounts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No accounts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add your first account to start managing your finances and
                tracking your wealth
              </p>
              <AddNewCard onAccountCreated={handleAccountCreated}>
                <Button
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Add Your First Account
                </Button>
              </AddNewCard>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-center justify-center ">
            {userData.accounts.map((account: any, index: number) => (
              <AccountCard key={account.id} account={account} index={index} />
            ))}
            <div
              className="animate-slideUp"
              style={{ animationDelay: `${userData.accounts.length * 100}ms` }}
            >
              <AddAccountCard onAccountCreated={handleAccountCreated} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
