"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { mockOrders } from "@/lib/data/orders";
import { mockUsers } from "@/lib/data/users";
import { mockVendors } from "@/lib/data/vendors";
import { Order, User, Vendor } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sprout, Menu, LogOut, Search, Eye, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-600",
  confirmed: "bg-blue-600",
  processing: "bg-purple-600",
  shipped: "bg-cyan-600",
  delivered: "bg-green-600",
  cancelled: "bg-red-600",
};

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  confirmed: <CheckCircle2 className="w-4 h-4" />,
  processing: <Truck className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle2 className="w-4 h-4" />,
  cancelled: <AlertCircle className="w-4 h-4" />,
};

export default function AdminOrders() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Get unique statuses
  const statuses = Array.from(new Set(orders.map((o) => o.status)));

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const buyer = mockUsers.find((u) => u.id === order.buyerId);
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || (buyer && buyer.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const completionRate = orders.length > 0 ? Math.round((orders.filter((o) => o.status === "delivered").length / orders.length) * 100) : 0;

  if (!user || user.role !== "admin") {
    return null;
  }

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
              <Link href="/admin/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/vendors" className="text-foreground hover:text-primary transition-colors">
                Vendors
              </Link>
              <Link href="/admin/orders" className="text-primary font-medium">
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
              <Link href="/admin/dashboard" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Dashboard
              </Link>
              <Link href="/admin/vendors" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Vendors
              </Link>
              <Link href="/admin/orders" className="block px-4 py-2 text-primary font-medium">
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
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Management</h1>
          <p className="text-lg text-muted-foreground">Monitor and manage all customer orders across the platform</p>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
              <p className="text-3xl font-bold"><span className="text-xs">Ksh </span> {totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Avg Order Value</p>
              <p className="text-3xl font-bold"> <span className="text-xs">Ksh </span>{averageOrderValue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div className="bg-card border border-border rounded-lg p-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilterStatus(null)} className={`px-4 py-2 rounded-lg font-medium transition-all ${filterStatus === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"}`}>
                All Orders
              </button>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all gap-2 flex items-center ${filterStatus === status ? `${statusColors[status as keyof typeof statusColors]} text-white` : "bg-muted hover:bg-muted/80 text-foreground"}`}
                >
                  {statusIcons[status as keyof typeof statusIcons]}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order, idx) => {
                const buyer = mockUsers.find((u) => u.id === order.buyerId);
                const vendor = mockVendors.find((v) => v.id === order.vendorId);
                return (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div>
                                <h3 className="text-lg font-bold text-foreground">Order #{order.id}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Customer</p>
                                <p className="font-medium">{buyer?.name || "Unknown"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Vendor</p>
                                <p className="font-medium">{vendor?.name || "Unknown"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Items</p>
                                <p className="font-medium">
                                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="font-bold text-lg"><span className="text-xs">Ksh </span>{order.total.toFixed(2)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                {statusIcons[order.status as keyof typeof statusIcons]}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <Badge variant="outline">Delivery: {order.deliveryType}</Badge>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 lg:min-w-fit">
                            <Button variant="outline" size="sm" onClick={() => openOrderDetails(order)} className="gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </Button>

                            {order.status !== "delivered" && order.status !== "cancelled" && (
                              <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No orders found matching your filters.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Order Details Modal */}
      {showDetailModal && selectedOrder && (
        <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowDetailModal(false)}>
          <motion.div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Order #{selectedOrder.id}</h2>
                <p className="text-muted-foreground">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.productName} x{item.quantity}
                        </span>
                        <span className="font-medium"><span className="text-xs">Ksh</span>{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal:</span>
                    <span><span className="text-xs">Ksh</span>{(selectedOrder.total * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Delivery Fee:</span>
                    <span><span className="text-xs">Ksh</span>{(selectedOrder.total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-border pt-2">
                    <span>Total:</span>
                    <span><span className="text-xs">Ksh</span>{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
                    <p className="text-sm font-medium">{selectedOrder.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Delivery Type</p>
                    <p className="text-sm font-medium capitalize">{selectedOrder.deliveryType}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
