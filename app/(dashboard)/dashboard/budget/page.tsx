"use client";

import { useSession } from "next-auth/react";
import { getBudgetQuery } from "@/features/budget/queries";
import { redirect } from "next/navigation";
import { BudgetCard } from "@/features/budget/components/BudgetCard";
import { BudgetModal } from "@/features/budget/components/BudgetModal";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { deleteBudget } from "@/features/budget/actions";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function BudgetPage() {
  const { data: session, status } = useSession();
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (session?.user?.id) {
      const fetchBudgets = async () => {
        try {
          const data = await getBudgetQuery();
          setBudgetData(data);
        } catch (error) {
          console.error("Error fetching budgets:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBudgets();
    }
  }, [session, status]);

  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (budgetToDelete) {
      const result = await deleteBudget(budgetToDelete);
      if (result.success) {
        setBudgetData(
          budgetData.filter((budget) => budget.id !== budgetToDelete),
        );
        setDeleteConfirmOpen(false);
        setBudgetToDelete(null);
      } else {
        console.error(result.error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setBudgetToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* --- Header Section --- */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Budżet
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Zarządzaj swoimi budżetami i śledź wydatki
            </p>
          </div>
          <BudgetModalButton />
        </div>
      </div>

      {/* --- Content Section --- */}
      {budgetData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 max-w-md"
          >
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-5xl">💰</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Brak budżetów
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Stwórz swój pierwszy budżet, aby zacząć kontrolować wydatki i
                osiągnąć swoje cele finansowe
              </p>
            </div>
            <BudgetModalButton />
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* --- Budget Stats Overview --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aktywne budżety
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {budgetData.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Całkowity limit
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(
                      budgetData.reduce((sum, b) => sum + b.amount, 0),
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💵</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wydatki
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(
                      budgetData.reduce((sum, b) => sum + b.spent, 0),
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💸</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pozostało
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(
                      budgetData.reduce(
                        (sum, b) => sum + Math.max(b.amount - b.spent, 0),
                        0,
                      ),
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Budget Cards Grid --- */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgetData.map((budget, index) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <BudgetCard
                  id={budget.id}
                  name={budget.name}
                  amount={budget.amount}
                  spent={budget.spent}
                  percentage={budget.percentage}
                  icon={budget.category?.icon || undefined}
                  categoryName={budget.category?.name}
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Usuń budżet
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Czy na pewno chcesz usunąć ten budżet? Tej czynności nie można
              cofnąć.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="w-full sm:w-auto"
            >
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto"
            >
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Client component for the button with modal state
function BudgetModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
      >
        <span className="text-lg">+</span>
        Nowy Budżet
      </Button>
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Refresh the page to show new budget
          window.location.reload();
        }}
      />
    </>
  );
}

// Helper function for currency formatting
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
