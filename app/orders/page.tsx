'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockOrders } from '@/lib/data/orders';
import { mockVendors } from '@/lib/data/vendors';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, CheckCircle, Truck, MapPin, Package } from 'lucide-react';

const statusConfig = {
  awaiting_confirmation: {
    label: 'Awaiting Confirmation',
    color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  accepted: {
    label: 'Accepted',
    color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    icon: CheckCircle,
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-purple-500/10 text-purple-700 border-purple-200',
    icon: Package,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-orange-500/10 text-orange-700 border-orange-200',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-500/10 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500/10 text-red-700 border-red-200',
    icon: Clock,
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Filter orders for the current buyer
  const userOrders = mockOrders.filter(order => order.buyerId === user.id);

  // Group orders by status
  const ordersByStatus = {
    active: userOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)),
    completed: userOrders.filter(o => o.status === 'delivered'),
    cancelled: userOrders.filter(o => o.status === 'cancelled'),
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-lg text-muted-foreground">
            Track your orders and manage your purchases
          </p>
        </motion.div>

        {userOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Start shopping to create your first order</p>
            <Button onClick={() => router.push('/marketplace')} size="lg">
              Browse Marketplace
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active Orders */}
            {ordersByStatus.active.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Active Orders</h2>
                <div className="space-y-4">
                  {ordersByStatus.active.map(order => {
                    const vendor = mockVendors.find(v => v.id === order.vendorId);
                    const config = statusConfig[order.status as keyof typeof statusConfig];
                    const StatusIcon = config.icon;

                    return (
                      <Link key={order.id} href={`/orders/${order.id}`}>
                        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-foreground mb-1">{vendor?.name}</h3>
                                <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${config.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                {config.label}
                              </div>
                            </div>

                            {/* Items Preview */}
                            <div className="mb-4 pb-4 border-b border-border">
                              <p className="text-sm text-muted-foreground mb-2">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </p>
                              <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                  <p key={idx} className="text-sm text-foreground">
                                    {item.productName} × {item.quantity}
                                  </p>
                                ))}
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="font-semibold text-foreground"><span className="text-xs">Ksh </span>{order.total.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Delivery Date</p>
                                <p className="font-semibold text-foreground">{order.deliveryDate}</p>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <p className="text-xs text-muted-foreground">Ordered</p>
                                <p className="font-semibold text-foreground">{order.createdAt}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {order.deliveryAddress}
                              </p>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Completed Orders */}
            {ordersByStatus.completed.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Completed Orders</h2>
                <div className="space-y-4">
                  {ordersByStatus.completed.map(order => {
                    const vendor = mockVendors.find(v => v.id === order.vendorId);
                    const config = statusConfig[order.status as keyof typeof statusConfig];
                    const StatusIcon = config.icon;

                    return (
                      <Link key={order.id} href={`/orders/${order.id}`}>
                        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-foreground mb-1">{vendor?.name}</h3>
                                <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${config.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                {config.label}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-foreground">${order.total.toFixed(2)}</p>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Cancelled Orders */}
            {ordersByStatus.cancelled.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Cancelled Orders</h2>
                <div className="space-y-4">
                  {ordersByStatus.cancelled.map(order => {
                    const vendor = mockVendors.find(v => v.id === order.vendorId);

                    return (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">{vendor?.name}</h3>
                              <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                            </div>
                            <p className="font-semibold text-foreground">${order.total.toFixed(2)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
