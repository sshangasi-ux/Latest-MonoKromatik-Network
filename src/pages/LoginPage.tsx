"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      // AuthContext handles navigation on success, so no explicit navigate here
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border text-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading uppercase tracking-tight">Login</CardTitle>
            <CardDescription className="text-muted-foreground font-sans">
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground uppercase font-semibold text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground uppercase font-semibold text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-destructive text-xs mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20">
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground font-sans">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary/90 underline uppercase font-semibold">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;