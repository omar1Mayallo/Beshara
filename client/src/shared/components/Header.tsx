"use client";

import LogoutButton from "@/app/(auth)/(components)/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { productsApi } from "@/lib/api";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "Deals", href: "/deals" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    if (user) {
      productsApi
        .getUserCart()
        .then((cart) =>
          setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
        )
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [user]);

  useEffect(() => {
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <p className="text-center text-sm font-medium">
            Free shipping on orders over $50! 🚚
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle>
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">
                          E
                        </span>
                      </div>
                      <span className="font-bold text-xl">EcoShop</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-4 p-4 border-b">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium py-2 px-2 rounded-md transition-colors hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="flex flex-col space-y-3 p-4">
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/account">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/cart">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  E
                </span>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                EcoShop
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="User account"
                  disabled={isLoading}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium border-b">
                      Welcome, {user.firstName} {user.lastName}!
                    </div>
                    <div className="px-2 py-1 text-xs text-muted-foreground border-b">
                      @{user.username} • {user.role}
                    </div>
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/orders" className="w-full">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <LogoutButton
                        variant="ghost"
                        size="sm"
                        showConfirm={false}
                      />
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link href="/login" className="w-full">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/register" className="w-full">
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Shopping cart"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
