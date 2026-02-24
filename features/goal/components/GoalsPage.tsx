"use client";

import { useState, useEffect } from "react";
import { GoalCard } from "./GoalCard";
import { GoalModal } from "./GoalModel";
import { Button } from "@/components/ui/button";
import { Plus, Target, TrendingUp, Calendar } from "lucide-react";
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
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* --- Header Section --- */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Cele finansowe
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Zarządzaj swoimi celami finansowymi i śledź postępy
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Dodaj cel
          </Button>
        </div>
      </div>

      {/* --- Stats Overview --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aktywne cele
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {goals.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Osiągnięte
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {goals.filter((g) => g.percentage >= 100).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    W toku
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {goals.filter((g) => g.percentage < 100).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Całkowita kwota
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    }).format(
                      goals.reduce((sum, g) => sum + g.targetAmount, 0),
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* --- Goals Content --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-indigo-500 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">🎯</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2 mt-6 text-center max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Brak celów finansowych
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Rozpocznij od dodania pierwszego celu finansowego, aby śledzić
                postępy i osiągać sukcesy.
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Dodaj pierwszy cel
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* --- Delete Confirmation Modal --- */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Usuń cel
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Czy na pewno chcesz usunąć ten cel? Tej czynności nie można
              cofnąć.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="w-full sm:w-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
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

      {/* --- Goal Modal --- */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGoalCreated}
      />
    </div>
  );
}
