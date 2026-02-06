import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AddNewCard } from "./AddNewCard";

interface AddAccountCardProps {
  onAccountCreated?: () => void;
}

export function AddAccountCard({ onAccountCreated }: AddAccountCardProps) {
  return (
    <AddNewCard onAccountCreated={onAccountCreated}>
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-400 dark:hover:border-gray-500 group">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 opacity-50" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-center h-20">
            <div className="p-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 group-hover:from-gray-500 group-hover:to-gray-600 transition-all duration-200">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Add New Account
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Click to create a new account
          </div>
        </CardContent>
      </Card>
    </AddNewCard>
  );
}
