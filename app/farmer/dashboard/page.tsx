'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockOrders } from '@/lib/data/orders';
import { mockVendors } from '@/lib/data/vendors';
import { mockProducts } from '@/lib/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sprout, ShoppingCart, TrendingUp, Users, LogOut, Menu, BarChart3, Package } from 'lucide-react';
import { useState } from 'react';

export default function FarmerDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'farmer') {
    return null;
  }

  // Get vendor data for the current farmer
  const vendor = mockVendors.find(v => v.name.includes('John') || v.name.includes('Lisa') || v.name.includes('Robert'));
  const vendorProducts = mockProducts.filter(p => p.vendorId === vendor?.id);
  const vendorOrders = mockOrders.filter(o => o.vendorId === vendor?.id);

  const pendingOrders = vendorOrders.filter(o => o.status === 'awaiting_confirmation');
  const activeOrders = vendorOrders.filter(o => ['accepted', 'preparing', 'out_for_delivery'].includes(o.status));
  const completedOrders = vendorOrders.filter(o => o.status === 'delivered');

  const totalRevenue = vendorOrders.reduce((sum, o) => sum + o.total, 0);
  const avgRating = vendor?.rating || 0;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
              <Link href="/farmer/analytics" className="text-foreground hover:text-primary transition-colors">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Farmer</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-border py-4 space-y-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/farmer/dashboard" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Dashboard
              </Link>
              <Link href="/farmer/products" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Products
              </Link>
              <Link href="/farmer/orders" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Orders
              </Link>
              <Link href="/farmer/analytics" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Analytics
              </Link>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {user.name}!</h1>
          <p className="text-lg text-muted-foreground">
            Manage your farm operations and track your sales
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pending Orders */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Pending Orders</p>
                    <p className="text-3xl font-bold text-foreground">{pendingOrders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Orders */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Active Orders</p>
                    <p className="text-3xl font-bold text-foreground">{activeOrders.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Revenue */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground"><span className="text-xs">Ksh </span> {totalRevenue.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rating */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Avg Rating</p>
                    <p className="text-3xl font-bold text-foreground">{avgRating}/5</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/farmer/products">
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Products
                  </Button>
                </Link>
                <Link href="/farmer/orders">
                  <Button className="w-full justify-start" variant="outline">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View All Orders
                  </Button>
                </Link>
                <Link href="/farmer/analytics">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Orders */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders ({pendingOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending orders</p>
                ) : (
                  <div className="space-y-4">
                    {pendingOrders.slice(0, 3).map(order => (
                      <Link key={order.id} href={`/farmer/orders/${order.id}`}>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''} • ${order.total.toFixed(2)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </Link>
                    ))}
                    {pendingOrders.length > 3 && (
                      <Link href="/farmer/orders">
                        <Button variant="outline" className="w-full">
                          View All Pending Orders
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
