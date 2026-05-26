"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { MarketplaceHeader } from "@/components/marketplace/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Phone, Clock, CreditCard, Check } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import MpesaPaymentCard from "@/components/MpesaPaymentCard";

type CheckoutStep = "delivery" | "payment" | "confirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<CheckoutStep>("payment");

  // Delivery form state
  const [deliveryData, setDeliveryData] = useState({
    address: "",
    phone: "",
    date: "",
    time: "morning", // morning, afternoon, evening
    notes: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Cart is Empty</h1>
            <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
          </div>
        </div>
      </div>
    );
  }

  const calculateSubtotal = () => {
    // In a real app, this would be calculated from actual product prices
    return totalPrice;
  };

  const tax = Math.round(calculateSubtotal() * 0.096 * 100) / 100;
  const deliveryFee = 5.0;
  const grandTotal = calculateSubtotal() + tax + deliveryFee;

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryData.address && deliveryData.phone && deliveryData.date) {
      setStep("payment");
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const newOrderId = `ORD-${Date.now()}`;
      setOrderId(newOrderId);
      setStep("confirmation");
      setIsProcessing(false);
    }, 2000);
  };

  const handleConfirmation = () => {
    clearCart();
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        {step !== "confirmation" && (
          <motion.button
            onClick={() => {
              if (step === "payment") {
                setStep("delivery");
              } else {
                router.back();
              }
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            whileHover={{ x: -4 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>
        )}

        {/* Progress Steps */}
        {step !== "confirmation" && (
          <div className="flex items-center justify-center gap-2 mb-12">
            {["delivery", "payment"].map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <motion.div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${s === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`} whileHover={{ scale: 1.1 }}>
                  {idx + 1}
                </motion.div>
                <span className={`text-sm font-medium ${s === step ? "text-primary" : "text-muted-foreground"}`}>{s === "delivery" ? "Delivery" : "Payment"}</span>
                {idx < 1 && <div className="w-8 h-px bg-border mx-2" />}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Delivery Step */}
              {step === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Delivery Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleDeliverySubmit} className="space-y-6">
                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Delivery Address</label>
                        <Input required placeholder="123 Main St, Los Angeles, CA 90001" value={deliveryData.address} onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })} />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone Number
                        </label>
                        <Input required type="tel" placeholder="+1 (555) 000-0000" value={deliveryData.phone} onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })} />
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Preferred Delivery Date
                        </label>
                        <Input required type="date" value={deliveryData.date} onChange={(e) => setDeliveryData({ ...deliveryData, date: e.target.value })} min={new Date().toISOString().split("T")[0]} />
                      </div>

                      {/* Time Window */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Preferred Time Window</label>

                        <Select value={deliveryData.time} onValueChange={(value) => setDeliveryData({ ...deliveryData, time: value })}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select time window" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                            <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Delivery Notes (Optional)</label>
                        <textarea placeholder="Any special instructions..." value={deliveryData.notes} onChange={(e) => setDeliveryData({ ...deliveryData, notes: e.target.value })} className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background" rows={4} />
                      </div>

                      <Button type="submit" className="w-full h-11" size="lg">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Payment Step */}
              {step === "payment" && (
                <MpesaPaymentCard deliveryData={deliveryData} amount={grandTotal.toFixed(2)}/>
              )}

              {/* Confirmation Step */}
              {step === "confirmation" && orderId && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                  <Card>
                    <CardContent className="pt-12 pb-12">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-primary" />
                      </motion.div>

                      <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
                      <p className="text-lg text-muted-foreground mb-6">Your order has been placed successfully.</p>

                      <div className="bg-muted/50 rounded-lg p-6 mb-8">
                        <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                        <p className="text-2xl font-mono font-bold text-foreground">{orderId}</p>
                      </div>

                      <p className="text-muted-foreground mb-8">Vendors will review your order and send updates. Track your order in the "My Orders" section.</p>

                      <div className="space-y-3">
                        <Button onClick={handleConfirmation} className="w-full h-11" size="lg">
                          View Order Details
                        </Button>
                        <Button onClick={() => router.push("/marketplace")} variant="outline" className="w-full">
                          Continue Shopping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2 pb-4 border-b border-border">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        <span className="text-xs">Ksh</span>
                        {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>
                      <span className="text-xs">Ksh</span>
                      {calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax</span>
                    <span>
                      <span className="text-xs">Ksh</span>
                      {tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Delivery Fee</span>
                    <span>
                      <span className="text-xs">Ksh</span>
                      {deliveryFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-2 flex justify-between font-bold text-lg text-primary">
                    <span>Total</span>
                    <span>
                      <span className="text-xs">Ksh</span>
                      {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
