import type { Metadata } from "next";
import RegisterForm from "../(components)/register-form";

export const metadata: Metadata = {
  title: "Create Account | EcoShop",
  description:
    "Create your EcoShop account to start shopping and enjoy exclusive benefits.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
