import type { Metadata } from "next";
import LoginForm from "../(components)/login-form";

export const metadata: Metadata = {
  title: "Sign In | EcoShop",
  description:
    "Sign in to your EcoShop account to access your orders, wishlist, and more.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
