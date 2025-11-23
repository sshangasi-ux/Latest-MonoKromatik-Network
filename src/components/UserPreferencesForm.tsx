"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define all possible categories. This could eventually come from a database.
const ALL_CATEGORIES = ["Music", "Tech", "Fashion", "Sports", "Culture", "Nature", "News", "Entertainment", "Documentary"];

const preferencesFormSchema = z.object({
  preferredCategories: z.array(z.string()).min(0, { message: "Please select at least one category or none." }),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

const UserPreferencesForm: React.FC = () => {
  const { user, updateUserPreferredCategories } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      preferredCategories: user?.user_metadata?.preferred_categories || [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        preferredCategories: user.user_metadata?.preferred_categories || [],
      });
    }
  }, [user, form]);

  const onSubmit = async (data: PreferencesFormValues) => {
    setIsSubmitting(true);
    try {
      await updateUserPreferredCategories(data.preferredCategories);
      toast.success("Your preferences have been saved!");
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="preferredCategories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-foreground uppercase font-semibold text-sm">Your Favorite Categories</FormLabel>
                <FormDescription className="font-sans text-muted-foreground">
                  Select the content categories you are most interested in.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ALL_CATEGORIES.map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name="preferredCategories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, category])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== category
                                      )
                                    );
                              }}
                              className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-foreground uppercase text-sm cursor-pointer">
                            {category}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
          {isSubmitting ? "Saving..." : "Save Preferences"}
        </Button>
      </form>
    </Form>
  );
};

export default UserPreferencesForm;