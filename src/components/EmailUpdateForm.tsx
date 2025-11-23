"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const emailUpdateFormSchema = z.object({
  newEmail: z.string().email({ message: "Please enter a valid email address." }),
});

type EmailUpdateFormValues = z.infer<typeof emailUpdateFormSchema>;

const EmailUpdateForm: React.FC = () => {
  const { user, updateUserEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmailUpdateFormValues>({
    resolver: zodResolver(emailUpdateFormSchema),
    defaultValues: {
      newEmail: user?.email || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        newEmail: user.email || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: EmailUpdateFormValues) => {
    setIsSubmitting(true);
    try {
      await updateUserEmail(data.newEmail);
      toast.success("Email update request sent! Please check your new email to confirm.");
      form.reset({ newEmail: data.newEmail }); // Update local state to new email
    } catch (error: any) {
      toast.error(`Failed to update email: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="newEmail" className="text-foreground uppercase font-semibold text-sm">New Email</Label>
        <Input
          id="newEmail"
          type="email"
          placeholder="new.email@example.com"
          className="bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
          {...form.register("newEmail")}
        />
        {form.formState.errors.newEmail && (
          <p className="text-destructive text-xs mt-1">{form.formState.errors.newEmail.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
        {isSubmitting ? "Updating..." : "Update Email"}
      </Button>
    </form>
  );
};

export default EmailUpdateForm;