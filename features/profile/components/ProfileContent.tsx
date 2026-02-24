"use client";

import { motion } from "framer-motion";
import { User, TrendingUp, PieChart, Activity } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { ProfileStats } from "./ProfileStats";

interface ProfileContentProps {
  userData: any;
  profileStats: any;
  session: any;
}

export function ProfileContent({ userData, profileStats, session }: ProfileContentProps) {
  return (
    <>
      {/* --- Header Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Profil użytkownika
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Zarządzaj swoimi danymi osobowymi i śledź finanse
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Witaj z powrotem</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {(userData as any)?.firstName || "Użytkownik"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Quick Stats --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktywne konta</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userData?.accounts?.length || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Wartość netto</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(profileStats.netWorth?.reduce((sum: number, item: any) => sum + Number(item._sum.balance || 0), 0) || 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dywidendy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Number(profileStats.totalDividends) || 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktywność</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profileStats.recentTransactions?.length || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Main Content --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left column - Profile Form */}
        <div className="lg:col-span-1">
          <ProfileForm
            initialData={{
              firstName: (userData as any)?.firstName || "",
              lastName: (userData as any)?.lastName || "",
              email: session?.user?.email || "",
            }}
          />
        </div>

        {/* Right column - Stats */}
        <div className="lg:col-span-2">
          <ProfileStats
            netWorth={profileStats.netWorth}
            lastYearNetWorth={profileStats.lastYearNetWorth}
            totalDividends={Number(profileStats.totalDividends)}
            monthlyData={profileStats.monthlyData}
            monthlyDividends={profileStats.monthlyDividends}
            recentTransactions={profileStats.recentTransactions}
          />
        </div>
      </motion.div>
    </>
  );
}
