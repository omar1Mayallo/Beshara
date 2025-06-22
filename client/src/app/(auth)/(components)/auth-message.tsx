"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, CheckCircle } from "lucide-react";

export default function AuthMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"info" | "warning" | "success">("info");

  useEffect(() => {
    const messageParam = searchParams.get("message");

    if (messageParam) {
      switch (messageParam) {
        case "already-logged-in":
          setMessage("You are already logged in.");
          setType("info");
          break;
        case "login-required":
          setMessage("Please log in to access this page.");
          setType("warning");
          break;
        case "logout-success":
          setMessage("You have been successfully logged out.");
          setType("success");
          break;
        case "session-expired":
          setMessage("Your session has expired. Please log in again.");
          setType("warning");
          break;
        default:
          setMessage(null);
      }

      // Clean up URL after showing message
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("message");
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, router]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case "warning":
        return "destructive" as const;
      case "success":
        return "default" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-6">
      {getIcon()}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
