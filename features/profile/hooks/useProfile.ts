"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfile } from "../components/actions";

const profileSchema = z
  .object({
    firstName: z.string().min(1, "Imię jest wymagane").optional(),
    lastName: z.string().min(1, "Nazwisko jest wymagane").optional(),
    email: z.string().email("Nieprawidłowy format email").optional(),
    currentPassword: z
      .string()
      .min(1, "Aktualne hasło jest wymagane")
      .optional(),
    newPassword: z
      .string()
      .min(6, "Nowe hasło musi mieć co najmniej 6 znaków")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Aktualne hasło jest wymagane przy zmianie hasła",
      path: ["currentPassword"],
    },
  );

type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfile(initialData: {
  firstName?: string;
  lastName?: string;
  email: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: any = {};

      if (data.firstName !== initialData.firstName) {
        updateData.firstName = data.firstName;
      }

      if (data.lastName !== initialData.lastName) {
        updateData.lastName = data.lastName;
      }

      if (data.email !== initialData.email) {
        updateData.email = data.email;
      }

      if (data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        setSuccess("Nie wprowadzono żadnych zmian");
        return;
      }

      const result = await updateProfile(updateData);

      setSuccess("Profil został pomyślnie zaktualizowany");

      // Reset password fields
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas aktualizacji profilu";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    error,
    success,
  };
}
