"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const passwordUpdateFormSchema = z.object({
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type PasswordUpdateFormValues = z.infer<typeof passwordUpdateFormSchema>;

const PasswordUpdateForm: React.FC = () => {
  const { updateUserPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: PasswordUpdateFormValues) => {
    setIsSubmitting(true);
    try {
      await updateUserPassword(data.newPassword);
      toast.success("Password updated successfully!");
      form.reset(); // Clear form fields
    } catch (error: any) {
      toast.error(`Failed to update password: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-foreground uppercase font-semibold text-sm">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          className="bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
          {...form.register("newPassword")}
        />
        {form.formState.errors.newPassword && (
          <p className="text-destructive text-xs mt-1">{form.formState.errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground uppercase font-semibold text-sm">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-destructive text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
        {isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
};

export default PasswordUpdateForm;