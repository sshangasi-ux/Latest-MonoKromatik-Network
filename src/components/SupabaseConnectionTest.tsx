"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SupabaseConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Checking Supabase connection...");

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (data.session) {
          setStatus("success");
          setMessage("Supabase connection successful! Session found.");
        } else {
          setStatus("success");
          setMessage("Supabase connection successful! No active session.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(`Supabase connection failed: ${err.message || "Unknown error"}. Please check your .env variables and Supabase project settings (CORS).`);
        console.error("Supabase connection test error:", err);
      }
    };

    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-card border-border text-foreground">
      <CardHeader>
        <CardTitle className="font-heading uppercase tracking-tight text-lg">Supabase Connection Status</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-3">
        {status === "loading" && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        {status === "success" && <CheckCircle className="h-6 w-6 text-green-500" />}
        {status === "error" && <XCircle className="h-6 w-6 text-destructive" />}
        <p className={`font-sans text-sm ${status === "success" ? "text-green-500" : status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
          {message}
        </p>
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionTest;