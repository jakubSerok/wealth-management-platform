"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Lock, Mail, UserCheck, Shield } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { motion } from "framer-motion";

interface ProfileFormProps {
  initialData: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const { form, onSubmit, isLoading, error, success } = useProfile(initialData);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="w-full border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Edytuj profil
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Zaktualizuj swoje dane osobowe i ustawienia bezpieczeństwa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50 dark:bg-red-900/20"
              >
                <AlertDescription className="text-red-800 dark:text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <AlertDescription className="text-green-800 dark:text-green-300">
                  {success}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* --- Personal Information --- */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                Dane osobowe
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Adres email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Wprowadź adres email"
                    className={`h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    Imię
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Wprowadź imię"
                    className={`h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${errors.firstName ? "border-red-500" : ""}`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Nazwisko
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Wprowadź nazwisko"
                    className={`h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${errors.lastName ? "border-red-500" : ""}`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Security Settings --- */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <Label className="text-base font-medium text-gray-900 dark:text-gray-100">
                    Zmień hasło
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {showPasswordFields ? "Anuluj" : "Zmień hasło"}
                </Button>
              </div>

              {showPasswordFields && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Obecne hasło
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...register("currentPassword")}
                      placeholder="Wprowadź obecne hasło"
                      className={`h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${errors.currentPassword ? "border-red-500" : ""}`}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Nowe hasło
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...register("newPassword")}
                      placeholder="Wprowadź nowe hasło (min. 6 znaków)"
                      className={`h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${errors.newPassword ? "border-red-500" : ""}`}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* --- Actions --- */}
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                className="px-6 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || !isDirty}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Zapisz zmiany
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
