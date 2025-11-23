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
import { User } from "lucide-react"; // For a placeholder avatar

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(50, { message: "Full name must not be longer than 50 characters." }),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      avatarUrl: user?.user_metadata?.avatar_url || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.user_metadata?.full_name || "",
        avatarUrl: user.user_metadata?.avatar_url || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await updateUserProfile(data.fullName, data.avatarUrl || null);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground uppercase font-semibold text-sm">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Your Full Name"
          className="bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
          {...form.register("fullName")}
        />
        {form.formState.errors.fullName && (
          <p className="text-destructive text-xs mt-1">{form.formState.errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl" className="text-foreground uppercase font-semibold text-sm">Avatar URL</Label>
        <div className="flex items-center space-x-4">
          {form.watch("avatarUrl") ? (
            <img
              src={form.watch("avatarUrl")}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border border-border">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Input
            id="avatarUrl"
            placeholder="https://example.com/avatar.jpg"
            className="flex-grow bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
            {...form.register("avatarUrl")}
          />
        </div>
        {form.formState.errors.avatarUrl && (
          <p className="text-destructive text-xs mt-1">{form.formState.errors.avatarUrl.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
        {isSubmitting ? "Saving..." : "Update Profile"}
      </Button>
    </form>
  );
};

export default ProfileForm;