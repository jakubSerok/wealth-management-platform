"use client";

import { useSession } from "next-auth/react";
import { getBudgetQuery } from "@/features/budget/queries";
import { redirect } from "next/navigation";
import { BudgetCard } from "@/features/budget/components/BudgetCard";
import { BudgetModal } from "@/features/budget/components/BudgetModal";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { deleteBudget } from "@/features/budget/actions";
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Budżet</h1>
          <p className="text-muted-foreground">
            Zarządzaj swoimi budżetami i śledź wydatki
          </p>
        </div>
        <BudgetModalButton />
      </div>

      {budgetData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold mb-2">Brak budżetów</h3>
          <p className="text-muted-foreground mb-6">
            Stwórz swój pierwszy budżet, aby zacząć kontrolować wydatki
          </p>
          <BudgetModalButton />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgetData.map((budget) => (
            <BudgetCard
              key={budget.id}
              id={budget.id}
              name={budget.name}
              amount={budget.amount}
              spent={budget.spent}
              percentage={budget.percentage}
              icon={budget.category?.icon || undefined}
              categoryName={budget.category?.name}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Budget</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
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
      <Button onClick={() => setIsModalOpen(true)}>Nowy Budżet</Button>
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
