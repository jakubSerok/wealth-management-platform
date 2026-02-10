"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Target,
  User,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { TransactionModal } from "@/features/transactions/components/TransactionModal";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Accounts", href: "/dashboard/accounts", icon: CreditCard },
  { name: "Transactions", href: "/dashboard/transactions", icon: TrendingUp },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Wealth Manager</h2>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Actions </h3>
        <Button
          onClick={() => setIsTransactionModalOpen(true)}
          className="w-full justify-start"
          variant="default"
        >
          <Plus className="mr-3 h-4 w-4" />
          New Transaction
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
}
