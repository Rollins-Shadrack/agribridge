'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockOrders } from '@/lib/data/orders';
import { mockVendors } from '@/lib/data/vendors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle, Clock, TrendingUp, Sprout, Menu, LogOut } from 'lucide-react';

export default function FarmerOrdersPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'active' | 'completed'>('pending');

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'farmer') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const vendor = mockVendors.find(v => v.name.includes('John') || v.name.includes('Lisa') || v.name.includes('Robert'));
  const vendorOrders = mockOrders.filter(o => o.vendorId === vendor?.id);

  const pendingOrders = vendorOrders.filter(o => o.status === 'awaiting_confirmation');
  const activeOrders = vendorOrders.filter(o => ['accepted', 'preparing', 'out_for_delivery'].includes(o.status));
  const completedOrders = vendorOrders.filter(o => o.status === 'delivered');

  const orders = {
    pending: pendingOrders,
    active: activeOrders,
    completed: completedOrders,
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: pendingOrders.length },
    { key: 'active', label: 'Active', count: activeOrders.length },
    { key: 'completed', label: 'Completed', count: completedOrders.length },
  ];

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
              <Link href="/farmer/orders" className="text-primary font-medium">
                Orders
              </Link>
              <Link href="/farmer/analytics" className="text-foreground hover:text-primary transition-colors">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
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
              <Link href="/farmer/orders" className="block px-4 py-2 text-primary font-medium">
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Orders</h1>
          <p className="text-lg text-muted-foreground">
            Manage and fulfill customer orders
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                selectedTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {orders[selectedTab].length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No {selectedTab} orders</p>
              </CardContent>
            </Card>
          ) : (
            orders[selectedTab].map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/farmer/orders/${order.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg mb-1">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Placed on {order.createdAt}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground capitalize">{order.status.replace('_', ' ')}</p>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-muted/30 rounded p-3 mb-4">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, i) => (
                            <p key={i} className="text-sm text-foreground">
                              {item.productName} × {item.quantity}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-muted-foreground">
                              +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Delivery: {order.deliveryDate} • {order.deliveryTime}
                        </p>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
