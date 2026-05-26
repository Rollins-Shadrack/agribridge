import { useState } from "react";
import { Smartphone, CheckCircle, AlertCircle, Loader2, Shield, Sprout } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

interface MpesaPaymentCardProps {
  amount?: string;
  currency?: string;
  deliveryData: {
    address: string;
    phone: string;
    date: string;
    time: string;
    notes: string;
  };
  onSubmit?: (phone: string) => void;
}

export default function MpesaPaymentCard({ amount = "2500", currency = "KES", deliveryData, onSubmit }: MpesaPaymentCardProps) {
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("0")) return "+254" + digits.slice(1);
    if (digits.startsWith("254")) return "+" + digits;
    if (digits.startsWith("+254")) return digits;
    return digits ? "254" + digits : "";
  };

  const displayPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.slice(0, 3) + " " + digits.slice(3);
    return digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6, 9);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(raw);
    setError("");
    setStatus("idle");
  };

  const validate = () => {
    if (phone.length < 9) {
      setError("Enter a valid Safaricom number (e.g. 07XX XXX XXX)");
      return false;
    }
    const prefix = phone.slice(0, 2);
    const valid = ["07", "01"].some((p) => ("0" + phone).startsWith(p)) || ["70", "71", "72", "74", "75", "76", "79", "10", "11"].includes(prefix);
    if (!valid) {
      setError("Number must be a Safaricom line");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    setError("");
    setStatus("idle");
    try {
      const res = await fetch("/api/daraja/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formatPhone(phone),
          amount,
          items,
          deliveryData,
          totalItems,
          totalPrice,
          userId:user?.id
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "STK push failed");
      }
      console.log(data);
      if (data?.ResponseCode !== "0") {
        throw new Error(data?.errorMessage || "Request rejected");
      }

      setStatus("success");
      onSubmit?.(formatPhone(phone));
      console.log("STK sent:", data);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Payment request failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatted = displayPhone(phone);
  const isComplete = phone.length === 9;

  return (
    <div className="relative w-full max-w-s mx-auto">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-linear-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl blur opacity-30 animate-pulse" />

      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/5">
        {/* Header band */}
        <div className="relative px-6 pt-6 pb-8 bg-linear-to-br from-green-500 via-emerald-600 to-teal-700 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="absolute top-4 -right-2 w-16 h-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 left-10 w-20 h-20 rounded-full bg-black/20" />

          {/* M-Pesa logo area */}
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-green-600 font-black text-sm leading-none">M</span>
              </div>
              <div>
                <p className="text-white font-black text-lg leading-none tracking-tight">M-PESA</p>
                <p className="text-green-100/70 text-xs font-medium mt-0.5">Lipa Na M-Pesa</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Shield className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-semibold">Secure</span>
            </div>
          </div>

          {/* Amount display */}
          <div>
            <p className="text-green-100/60 text-xs font-medium uppercase tracking-wider mb-1">Amount to Pay</p>
            <div className="flex items-baseline gap-2">
              <span className="text-white/60 text-base font-medium">{currency}</span>
              <span className="text-white text-4xl font-black tracking-tight">{amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {status === "success" ? (
            <SuccessState phone={formatPhone(phone)} amount={amount} currency={currency} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone input */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">M-Pesa Phone Number</label>

                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-200 border-zinc-400 ${error ? "border-red-500/60 bg-red-500/5" : isComplete ? "border-green-500/60 bg-green-500/5" : "border-white/10 bg-white/5 focus-within:border-green-500/50 focus-within:bg-white/8"}`}
                >
                  {/* Country flag / prefix */}
                  <div className="flex items-center gap-2 pl-4 pr-3 border-r border-white/10 py-3.5 shrink-0">
                    <span className="text-base leading-none">🇰🇪</span>
                    <span className="text-zinc-400 text-sm font-mono font-medium">+254</span>
                  </div>

                  <div className="relative flex-1 flex items-center">
                    <Smartphone className="absolute left-3 w-4 h-4 text-zinc-500" />
                    <input type="tel" inputMode="numeric" value={formatted} onChange={handlePhoneChange} placeholder="7XX XXX XXX" maxLength={11} className="w-full bg-transparent pl-9 pr-4 py-3.5 text-zinc-600 placeholder-zinc-600 font-mono text-base focus:outline-none" />
                    {isComplete && !error && <CheckCircle className="absolute right-3 w-4 h-4 text-green-400 shrink-0" />}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs">{error}</p>
                  </div>
                )}
              </div>

              {/* STK push info */}
              <div className="bg-linear-to-br from-green-400 via-emerald-500 to-teal-600 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sprout className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-zinc-200 text-sm font-medium mb-1">STK Push Prompt</p>
                    <p className="text-zinc-200 text-xs leading-relaxed">A payment prompt will be sent to your phone. Enter your M-Pesa PIN to confirm.</p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing || !isComplete}
                className={`relative w-full h-13 rounded-xl font-bold text-sm transition-all duration-200 overflow-hidden ${
                  isProcessing || !isComplete ? "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5" : "bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98]"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending prompt...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>
                      Pay {currency} {amount.toLocaleString()}
                    </span>
                  </span>
                )}
              </button>

              <p className="text-center text-zinc-600 text-xs">
                By paying you agree to our <span className="text-zinc-400 underline underline-offset-2 cursor-pointer hover:text-white transition-colors">terms & conditions</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessState({ phone, amount, currency }: { phone: string; amount: string; currency: string }) {
  return (
    <div className="flex flex-col items-center text-center py-4 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
      </div>
      <div>
        <p className="text-white font-bold text-lg">Prompt Sent!</p>
        <p className="text-zinc-400 text-sm mt-1">
          Check <span className="text-white font-mono">{phone}</span> for the M-Pesa prompt
        </p>
      </div>
      <div className="w-full bg-white/3 border border-white/8 rounded-xl p-4 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Amount</span>
          <span className="text-white font-semibold">
            {currency} {amount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-zinc-500">Status</span>
          <span className="text-green-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Awaiting PIN
          </span>
        </div>
      </div>
      <p className="text-zinc-600 text-xs">Enter your M-Pesa PIN on your phone to complete payment</p>
    </div>
  );
}
