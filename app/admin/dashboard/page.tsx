"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { mockOrders } from "@/lib/data/orders";
import { mockVendors } from "@/lib/data/vendors";
import { mockProducts } from "@/lib/data/products";
import { mockUsers } from "@/lib/data/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sprout, Menu, LogOut, Users, Store, Package, TrendingUp, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Calculate marketplace metrics
  const totalVendors = mockVendors.length;
  const verifiedVendors = mockVendors.filter((v) => v.verified).length;
  const totalProducts = mockProducts.length;
  const totalOrders = mockOrders.length;
  const totalUsers = mockUsers.length;
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);

  const completeRate = totalOrders > 0 ? Math.round((mockOrders.filter((o) => o.status === "delivered").length / totalOrders) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Sprout className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-foreground hidden sm:inline">AgriBridge Admin</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/admin/dashboard" className="text-primary font-medium">
                Dashboard
              </Link>
              <Link href="/admin/vendors" className="text-foreground hover:text-primary transition-colors">
                Vendors
              </Link>
              <Link href="/admin/orders" className="text-foreground hover:text-primary transition-colors">
                Orders
              </Link>
              <Link href="/admin/analytics" className="text-foreground hover:text-primary transition-colors">
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
              <Link href="/admin/dashboard" className="block px-4 py-2 text-primary font-medium">
                Dashboard
              </Link>
              <Link href="/admin/vendors" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Vendors
              </Link>
              <Link href="/admin/orders" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Orders
              </Link>
              <Link href="/admin/analytics" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Analytics
              </Link>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Monitor marketplace activity and manage operations</p>
        </motion.div>

        {/* KPI Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12" variants={containerVariants} initial="hidden" animate="visible">
          {/* Total Users */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Vendors */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Vendors</p>
                    <p className="text-3xl font-bold text-foreground">{totalVendors}</p>
                    <p className="text-xs text-primary mt-1">{verifiedVendors} verified</p>
                  </div>
                  <Store className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Products */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Products</p>
                    <p className="text-3xl font-bold text-foreground">{totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Orders */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
                    <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
                    <p className="text-xs text-primary mt-1">{completeRate}% completed</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Revenue & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Total Revenue Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Marketplace Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-foreground mb-2"> <span className="text-xs">Ksh </span>{totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total transaction value from {totalOrders} orders</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Vendor Verification</span>
                    <span className="text-sm font-medium text-foreground">
                      {verifiedVendors}/{totalVendors}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(verifiedVendors / totalVendors) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Order Completion</span>
                    <span className="text-sm font-medium text-foreground">{completeRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${completeRate}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/admin/vendors">
                <Button className="w-full justify-start" variant="outline">
                  <Store className="w-4 h-4 mr-2" />
                  Manage Vendors
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Monitor Orders
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/marketplace")}>
                <Package className="w-4 h-4 mr-2" />
                View Marketplace
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items • ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground capitalize">{order.status.replace("_", " ")}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
