"use client";

import { useCart } from "@/lib/cart-context";
import { MarketplaceHeader } from "@/components/marketplace/header";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Phone, Clock, Check, ShoppingBag, MessageCircle, User } from "lucide-react";

// Keep your existing project imports for:
// MarketplaceHeader
// useCart

type DeliveryData = {
  fullName: string;
  address: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
};

const WHATSAPP_NUMBER = "254795821921";

const formatKES = (amount: number) =>
  `KES ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    fullName: "",
    address: "",
    phone: "",
    date: "",
    time: "morning",
    notes: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = totalPrice;
  const tax = Math.round(subtotal * 0.16 * 100) / 100;
  const deliveryFee = 100.0;
  const grandTotal = subtotal + tax + deliveryFee;

  // Use local date rather than UTC to avoid date discrepancies.
  const today = (() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  })();

  const updateDeliveryData = (field: keyof DeliveryData, value: string) => {
    setDeliveryData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const buildOrderMessage = (reference: string) => {
    const productDetails = items
      .map((item, index) => {
        const itemTotal = item.price * item.quantity;

        return [`${index + 1}. ${item.productName}`, `   Quantity: ${item.quantity}`, `   Unit Price: ${formatKES(item.price)}`, `   Total: ${formatKES(itemTotal)}`].join("\n");
      })
      .join("\n\n");

    const timeLabels: Record<string, string> = {
      morning: "Morning (8 AM - 12 PM)",
      afternoon: "Afternoon (12 PM - 5 PM)",
      evening: "Evening (5 PM - 8 PM)",
    };

    return ["🛒 *NEW MARKETPLACE ORDER*", "━━━━━━━━━━━━━━━━━━━━", "", `📦 *Order Reference:* ${reference}`, "", "👤 *CUSTOMER DETAILS*", `Name: ${deliveryData.fullName}`, `Phone: ${deliveryData.phone}`, "", "📍 *DELIVERY DETAILS*", `Address: ${deliveryData.address}`, `Date: ${deliveryData.date}`, `Preferred Time: ${timeLabels[deliveryData.time] || deliveryData.time}`, `Notes: ${deliveryData.notes || "None"}`, "", "🛍️ *ORDER ITEMS*", "━━━━━━━━━━━━━━━━━━━━", productDetails, "", "💰 *ORDER SUMMARY*", `Subtotal: ${formatKES(subtotal)}`, `Tax (9.6%): ${formatKES(tax)}`, `Delivery Fee: ${formatKES(deliveryFee)}`, "━━━━━━━━━━━━━━━━━━━━", `*GRAND TOTAL: ${formatKES(grandTotal)}*`, "━━━━━━━━━━━━━━━━━━━━", "", "Please confirm availability and arrange payment with the customer.", "", "Sent from the Mavuno Fresh Marketplace."].join("\n");
  };

  const handlePlaceOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0 || isProcessing) return;

    setIsProcessing(true);

    try {
      const newOrderId = `ORD-${Date.now()}`;

      const message = buildOrderMessage(newOrderId);

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      setOrderId(newOrderId);

      // Open WhatsApp with the pre-filled order.
      // The customer must manually press Send.
      const whatsappWindow = window.open(whatsappUrl, "_blank");

      // Fallback in case the browser blocks popups.
      if (!whatsappWindow) {
        window.location.assign(whatsappUrl);
      }
    } catch (error) {
      console.error("Failed to prepare WhatsApp order:", error);

      setOrderId(null);
      alert("Unable to prepare your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    // The customer confirms they have sent the WhatsApp message.
    clearCart();
    router.push("/marketplace");
  };

  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />

        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />

          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>

          <p className="text-muted-foreground mb-6">Add some products before proceeding to checkout.</p>

          <button onClick={() => router.push("/marketplace")} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        {!orderId && (
          <motion.button onClick={() => router.back()} className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8" whileHover={{ x: -4 }}>
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CHECKOUT */}
          <div className="lg:col-span-2">
            {!orderId ? (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingBag className="w-6 h-6 text-primary" />

                      <h1 className="text-2xl font-bold">Complete Your Order</h1>
                    </div>

                    <p className="text-muted-foreground text-sm">Provide your details and send your order directly to our team through WhatsApp.</p>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    {/* CUSTOMER NAME */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>

                      <input required type="text" autoComplete="name" placeholder="Enter your full name" value={deliveryData.fullName} onChange={(e) => updateDeliveryData("fullName", e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>

                    {/* PHONE */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Mobile Number
                      </label>

                      <input required type="tel" autoComplete="tel" placeholder="e.g. 0712345678" value={deliveryData.phone} onChange={(e) => updateDeliveryData("phone", e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />

                      <p className="text-xs text-muted-foreground mt-1">We will use this number to contact you about your order.</p>
                    </div>

                    {/* DELIVERY ADDRESS */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Delivery Address
                      </label>

                      <textarea required rows={3} placeholder="Enter your delivery location, estate, street or landmarks..." value={deliveryData.address} onChange={(e) => updateDeliveryData("address", e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                    </div>

                    {/* DELIVERY DATE */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Preferred Delivery Date
                      </label>

                      <input required type="date" min={today} value={deliveryData.date} onChange={(e) => updateDeliveryData("date", e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>

                    {/* DELIVERY TIME */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Delivery Time</label>

                      <select value={deliveryData.time} onChange={(e) => updateDeliveryData("time", e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="morning">Morning (8 AM - 12 PM)</option>

                        <option value="afternoon">Afternoon (12 PM - 5 PM)</option>

                        <option value="evening">Evening (5 PM - 8 PM)</option>
                      </select>
                    </div>

                    {/* NOTES */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Delivery Instructions (Optional)</label>

                      <textarea rows={3} placeholder="Any special instructions..." value={deliveryData.notes} onChange={(e) => updateDeliveryData("notes", e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                    </div>

                    {/* SUBMIT */}
                    <button type="submit" disabled={isProcessing || items.length === 0} className="w-full h-12 flex items-center justify-center gap-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <MessageCircle className="w-5 h-5" />

                      {isProcessing ? "Preparing Order..." : "Place Order via WhatsApp"}
                    </button>

                    <p className="text-xs text-center text-muted-foreground">Your order details will be prepared in WhatsApp. You must press Send to submit your order.</p>
                  </form>
                </div>
              </motion.div>
            ) : (
              /* ORDER MESSAGE PREPARED */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-xl p-6 sm:p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold mb-3">Your Order is Ready!</h1>

                <p className="text-muted-foreground mb-6">We have prepared your order message and opened WhatsApp. Please review the details and press Send.</p>

                <div className="bg-muted/50 rounded-lg p-5 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Order Reference</p>

                  <p className="text-2xl font-mono font-bold">{orderId}</p>
                </div>

                <div className="rounded-lg border border-green-600/30 bg-green-600/5 p-4 mb-8 text-left">
                  <p className="font-semibold mb-2">
                    <Check className="w-4 h-4 inline mr-2 text-green-600" />
                    Almost there!
                  </p>

                  <p className="text-sm text-muted-foreground">
                    1. Check that WhatsApp has opened.
                    <br />
                    2. Review your order details.
                    <br />
                    3. Press the Send button in WhatsApp.
                    <br />
                    4. Our team will contact you to confirm your order.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const message = buildOrderMessage(orderId);
                    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

                    window.open(url, "_blank");
                  }}
                  className="w-full h-12 flex items-center justify-center gap-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold mb-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Open WhatsApp Again
                </button>

                <button onClick={handleFinish} className="w-full h-12 rounded-lg border border-border hover:bg-muted font-semibold">
                  I've Sent My Order — Continue
                </button>

                <p className="text-xs text-muted-foreground mt-5">Your order is not submitted until you send the WhatsApp message.</p>
              </motion.div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* ITEMS */}
              <div className="space-y-4 pb-5 border-b border-border">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium">{item.productName}</p>

                      <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>

                    <p className="font-semibold whitespace-nowrap">{formatKES(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* TOTALS */}
              <div className="space-y-3 pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>

                  <span>{formatKES(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (9.6%)</span>

                  <span>{formatKES(tax)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>

                  <span>{formatKES(deliveryFee)}</span>
                </div>

                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg text-primary">
                  <span>Total</span>

                  <span>{formatKES(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />

                  <p className="font-semibold text-sm">WhatsApp Ordering</p>
                </div>

                <p className="text-xs text-muted-foreground">Your order will be sent to our team for confirmation. Payment arrangements will be discussed directly.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
