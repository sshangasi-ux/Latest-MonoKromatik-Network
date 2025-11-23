"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { DialogFooter } from "@/components/ui/dialog";

const updateEmailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type UpdateEmailFormValues = z.infer<typeof updateEmailFormSchema>;

interface UpdateEmailFormProps {
  onClose: () => void;
}

const UpdateEmailForm: React.FC<UpdateEmailFormProps> = ({ onClose }) => {
  const { user, updateUserEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailFormSchema),
    defaultValues: {
      email: user?.email || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: UpdateEmailFormValues) => {
    setIsLoading(true);
    try {
      await updateUserEmail(data.email);
      toast.success("Email updated successfully! Please check your new email for verification.");
      onClose();
    } catch (error: any) {
      console.error("Failed to update email:", error);
      toast.error(error.message || "Failed to update email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@example.com"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus:ring-red-600"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Email"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateEmailForm;