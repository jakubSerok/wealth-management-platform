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
  PieChart,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { TransactionModal } from "@/features/transactions/components/TransactionModal";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Budget", href: "/dashboard/budget", icon: CreditCard },
  { name: "Transactions", href: "/dashboard/transactions", icon: TrendingUp },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Investments", href: "/dashboard/investments", icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const sidebarContent = (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Wealth Manager
        </h2>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={handleLinkClick}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
                  isActive &&
                    "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800",
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
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
          Actions
        </h3>
        <Button
          onClick={() => setIsTransactionModalOpen(true)}
          className="w-full justify-start transition-all duration-200 hover:scale-105"
          variant="default"
        >
          <Plus className="mr-3 h-4 w-4" />
          New Transaction
        </Button>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-all duration-200"
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
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Wealth Manager
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out pt-16",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="h-full overflow-y-auto p-4 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4 flex flex-col">
      {sidebarContent}
    </div>
  );
}
