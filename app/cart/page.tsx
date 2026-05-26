'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();

  // Group items by vendor
  const itemsByVendor = items.reduce((acc, item) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = [];
    }
    acc[item.vendorId].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          whileHover={{ x: -4 }}
        >
          <ChevronLeft className="w-5 h-5" />
          Continue Shopping
        </motion.button>

        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Start adding fresh produce to your cart!</p>
            <Button onClick={() => router.push('/marketplace')} size="lg">
              Browse Products
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {Object.entries(itemsByVendor).map(([vendorId, vendorItems]) => (
                  <Card key={vendorId}>
                    <CardHeader>
                      <CardTitle className="text-lg">Vendor Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {vendorItems.map(item => (
                        <motion.div
                          key={item.productId}
                          layout
                          className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                        >
                          {/* Image */}
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-24 h-24 rounded-lg object-cover"
                          />

                          {/* Details */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{item.productName}</h3>
                            <p className="text-lg font-bold text-primary mb-2"><span className="text-xs">Ksh</span>{item.price.toFixed(2)}</p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 text-foreground font-semibold min-w-10 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1 hover:bg-muted rounded transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price & Actions */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground mb-4">
                              <span className="text-xs">Ksh</span>{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>

            {/* Summary Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items Count */}
                  <div className="flex justify-between text-foreground">
                    <span>Items ({totalItems})</span>
                    <span><span className="text-xs">Ksh</span>{totalPrice.toFixed(2)}</span>
                  </div>

                  {/* Subtotal */}
                  <div className="border-t border-border pt-4 flex justify-between font-semibold text-foreground">
                    <span>Subtotal</span>
                    <span><span className="text-xs">Ksh</span>{totalPrice.toFixed(2)}</span>
                  </div>

                  {/* Note */}
                  <p className="text-xs text-muted-foreground">
                    Delivery fee and taxes will be calculated at checkout
                  </p>

                  {/* Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleCheckout}
                      className="w-full h-11"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      onClick={() => router.push('/marketplace')}
                      variant="outline"
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                    {items.length > 0 && (
                      <Button
                        onClick={clearCart}
                        variant="ghost"
                        className="w-full text-destructive"
                      >
                        Clear Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
