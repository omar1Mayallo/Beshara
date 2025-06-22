"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { removeAuthToken } from "@/lib/auth";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
  showConfirm?: boolean;
}

export default function LogoutButton({
  variant = "ghost",
  size = "default",
  showIcon = true,
  showConfirm = true,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // Remove token from storage
      removeAuthToken();

      // Optional: Call logout endpoint if your backend has one
      // await fetch('/api/auth/logout', { method: 'POST' })

      // Redirect to login with success message
      window.location.href = "/login?message=logout-success";
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even on error
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const LogoutTrigger = (
    <Button variant={variant} size={size} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4 mr-2" />}
          Logout
        </>
      )}
    </Button>
  );

  if (!showConfirm) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {showIcon && <LogOut className="h-4 w-4 mr-2" />}
            Logout
          </>
        )}
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{LogoutTrigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of your account and redirected to the login
            page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
