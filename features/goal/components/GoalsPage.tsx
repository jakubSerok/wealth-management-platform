"use client";

import { useState, useEffect } from "react";
import { GoalCard } from "./GoalCard";
import { GoalModal } from "./GoalModel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GoalWithProgress } from "../types";
import { deleteGoal } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface GoalsPageProps {
  initialGoals: GoalWithProgress[];
}

export function GoalsPage({ initialGoals }: GoalsPageProps) {
  const [goals, setGoals] = useState<GoalWithProgress[]>(initialGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const handleGoalCreated = () => {
    // Refetch goals or update state
    window.location.reload();
  };

  const handleDeleteClick = (id: string) => {
    setGoalToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (goalToDelete) {
      const result = await deleteGoal(goalToDelete);
      if (result.success) {
        setGoals(goals.filter((goal) => goal.id !== goalToDelete));
        setDeleteConfirmOpen(false);
        setGoalToDelete(null);
      } else {
        console.error(result.error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setGoalToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">Manage your financial goals</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold mb-2">No financial goals</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first financial goal to track progress and
              achieve success.
            </p>
            <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Add first goal
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGoalCreated}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be
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
