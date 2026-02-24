import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AddNewCard } from "./AddNewCard";
import { motion } from "framer-motion";

interface AddAccountCardProps {
  onAccountCreated?: () => void;
}

export function AddAccountCard({ onAccountCreated }: AddAccountCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ y: -5 }}
    >
      <AddNewCard onAccountCreated={onAccountCreated}>
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer border-2 border-dashed border-blue-300 bg-linear-to-br from-blue-50 to-indigo-50 hover:border-blue-400 group min-h-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-linear-to-br from-blue-100/20 to-indigo-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10">
            <motion.div
              className="p-4 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-8 w-8 text-white" />
            </motion.div>

            <div className="text-center mt-4 space-y-2">
              <div className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                Add New Account
              </div>
              <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                Click to create a new account
              </div>
            </div>
          </div>
        </Card>
      </AddNewCard>
    </motion.div>
  );
}
