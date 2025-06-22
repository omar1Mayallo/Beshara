"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productsApi, CartItem, ApiError } from "@/lib/api";
import { useAuth } from "@/shared/context/auth-context";

export default function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/cart&message=login-required");
      return;
    }

    async function fetchCart() {
      try {
        setIsLoading(true);
        const items = await productsApi.getUserCart();
        console.log("Raw Cart Items:", items);
        setCartItems(items);
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message, {
            description: error.code || "Failed to load cart.",
            style: { color: "white", backgroundColor: "black" },
          });
        } else {
          toast.error("An unexpected error occurred.", {
            style: { color: "white", backgroundColor: "black" },
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, authLoading, router]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingItemId(itemId);
    try {
      const item = cartItems.find((i) => i.id === itemId);
      if (!item) return;
      await productsApi.addToCart(
        item.product_id,
        newQuantity,
        item.selected_color,
        item.selected_size
      );
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
      );
      toast.success("Quantity updated successfully.", {
        style: { color: "white", backgroundColor: "black" },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message, {
          description: error.code || "Failed to update quantity.",
          style: { color: "white", backgroundColor: "black" },
        });
      } else {
        toast.error("An unexpected error occurred.", {
          style: { color: "white", backgroundColor: "black" },
        });
      }
    } finally {
      setUpdatingItemId(null);
    }
  };

  const calculateSubtotal = () =>
    cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // Dropped outside the list

    const reorderedItems = Array.from(cartItems);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setCartItems(reorderedItems);
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShoppingCart className="h-6 w-6" />
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              Your cart is empty.
            </p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] hidden sm:table-cell">
                          Image
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <Droppable droppableId="cart-items">
                      {(provided) => (
                        <TableBody
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {cartItems.map((item, index) => (
                            <Draggable
                              key={`${item.id}-${
                                item.selected_size || "no-size"
                              }-${item.quantity}`}
                              draggableId={`${item.id}-${
                                item.selected_size || "no-size"
                              }-${item.quantity}`}
                              index={index}
                              isDragDisabled={updatingItemId === item.id}
                            >
                              {(provided, snapshot) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={
                                    snapshot.isDragging ? "bg-muted" : ""
                                  }
                                >
                                  <TableCell className="hidden sm:table-cell">
                                    <Image
                                      src={item.images[0] || "/placeholder.png"}
                                      alt={item.name}
                                      width={80}
                                      height={80}
                                      className="rounded-md object-cover"
                                      loading="lazy"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Link
                                      href={`/products/${item.product_id}`}
                                      className="font-medium hover:underline"
                                    >
                                      {item.name}
                                    </Link>
                                    {item.selected_color && (
                                      <p className="text-sm text-muted-foreground">
                                        Color: {item.selected_color}
                                      </p>
                                    )}
                                    {item.selected_size && (
                                      <p className="text-sm text-muted-foreground">
                                        Size: {item.selected_size}
                                      </p>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ${parseFloat(item.price).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.id,
                                            item.quantity - 1
                                          )
                                        }
                                        disabled={
                                          item.quantity <= 1 ||
                                          updatingItemId === item.id
                                        }
                                        aria-label={`Decrease quantity of ${item.name}`}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="w-8 text-center">
                                        {item.quantity}
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.id,
                                            item.quantity + 1
                                          )
                                        }
                                        disabled={
                                          item.quantity >=
                                            item.stock_quantity ||
                                          updatingItemId === item.id
                                        }
                                        aria-label={`Increase quantity of ${item.name}`}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    $
                                    {(
                                      parseFloat(item.price) * item.quantity
                                    ).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      disabled={updatingItemId === item.id}
                                      aria-label={`Remove ${item.name} from cart`}
                                    >
                                      {updatingItemId === item.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TableBody>
                      )}
                    </Droppable>
                  </Table>
                </DragDropContext>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <Button
                  className="w-full"
                  asChild
                  disabled={cartItems.length === 0}
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
