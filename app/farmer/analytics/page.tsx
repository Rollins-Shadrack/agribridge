"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { mockOrders } from "@/lib/data/orders";
import { mockVendors } from "@/lib/data/vendors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Sprout, Menu, LogOut, TrendingUp, Star } from "lucide-react";

export default function FarmerAnalyticsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "farmer") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "farmer") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const vendor = mockVendors.find((v) => v.name.includes("John") || v.name.includes("Lisa") || v.name.includes("Robert"));
  const vendorOrders = mockOrders.filter((o) => o.vendorId === vendor?.id);

  // Revenue data
  const revenueByDate = vendorOrders.reduce((acc, order) => {
    const date = order.createdAt;
    const existing = acc.find((d) => d.date === date);
    if (existing) {
      existing.revenue += order.total;
      existing.orders += 1;
    } else {
      acc.push({ date, revenue: order.total, orders: 1 });
    }
    return acc;
  }, [] as any[]);

  // Status distribution
  const statusCounts = {
    awaiting_confirmation: vendorOrders.filter((o) => o.status === "awaiting_confirmation").length,
    accepted: vendorOrders.filter((o) => o.status === "accepted").length,
    preparing: vendorOrders.filter((o) => o.status === "preparing").length,
    out_for_delivery: vendorOrders.filter((o) => o.status === "out_for_delivery").length,
    delivered: vendorOrders.filter((o) => o.status === "delivered").length,
    cancelled: vendorOrders.filter((o) => o.status === "cancelled").length,
  };

  const pieData = [
    { name: "Delivered", value: statusCounts.delivered, fill: "#22c55e" },
    { name: "Active", value: statusCounts.accepted + statusCounts.preparing + statusCounts.out_for_delivery, fill: "#3b82f6" },
    { name: "Pending", value: statusCounts.awaiting_confirmation, fill: "#eab308" },
    { name: "Cancelled", value: statusCounts.cancelled, fill: "#ef4444" },
  ];

  const totalRevenue = vendorOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = vendorOrders.length > 0 ? totalRevenue / vendorOrders.length : 0;
  const totalOrders = vendorOrders.length;
  const completionRate = vendorOrders.length > 0 ? Math.round((statusCounts.delivered / vendorOrders.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/farmer/dashboard" className="flex items-center gap-2">
              <Sprout className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-foreground hidden sm:inline">AgriBridge</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/farmer/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/farmer/products" className="text-foreground hover:text-primary transition-colors">
                Products
              </Link>
              <Link href="/farmer/orders" className="text-foreground hover:text-primary transition-colors">
                Orders
              </Link>
              <Link href="/farmer/analytics" className="text-primary font-medium">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div className="md:hidden border-t border-border py-4 space-y-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/farmer/dashboard" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Dashboard
              </Link>
              <Link href="/farmer/products" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Products
              </Link>
              <Link href="/farmer/orders" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Orders
              </Link>
              <Link href="/farmer/analytics" className="block px-4 py-2 text-primary font-medium">
                Analytics
              </Link>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-lg text-muted-foreground">Track your farm performance and sales metrics</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground"><span className="text-xs">Ksh </span>{totalRevenue.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
                  <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Avg Order Value</p>
                  <p className="text-3xl font-bold text-foreground">${avgOrderValue.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Completion Rate</p>
                  <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--color-card)" }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Status Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData.filter((d) => d.value > 0)} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Vendor Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Farm Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Farm Name</p>
                  <p className="font-semibold text-foreground">{vendor?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Rating</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{vendor?.rating}/5</p>
                    <Star className="w-4 h-4 fill-primary text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Verified</p>
                  <p className="font-semibold text-foreground">{vendor?.verified ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Success Rate</p>
                  <p className="font-semibold text-foreground">{vendor?.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
