"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { authApi, ApiError } from "@/lib/api";
import AuthMessage from "./auth-message";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      address: "",
    },
  });

  const watchPassword = form.watch("password");

  const getPasswordStrength = (password: string) => {
    const requirements = [
      { met: password.length >= 8, text: "At least 8 characters" },
      { met: /[A-Z]/.test(password), text: "One uppercase letter" },
      { met: /[0-9]/.test(password), text: "One digit" },
      { met: /[^a-zA-Z0-9]/.test(password), text: "One special character" },
    ];
    return requirements;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await authApi.register(data);

      setSuccess(true);

      // Redirect after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AuthMessage />
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Account created successfully! Redirecting to login...
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="John"
                        disabled={isLoading}
                        autoComplete="given-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Doe"
                        disabled={isLoading}
                        autoComplete="family-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="johndoe"
                      disabled={isLoading}
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormDescription>
                    3-20 characters, letters, numbers, and underscores only
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john@example.com"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  {watchPassword && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium">
                        Password requirements:
                      </p>
                      {getPasswordStrength(watchPassword).map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              req.met ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          <span
                            className={
                              req.met
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="123 Main St, City, State, ZIP"
                      disabled={isLoading}
                      autoComplete="street-address"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be used for shipping and billing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
