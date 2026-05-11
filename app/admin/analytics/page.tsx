'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockOrders } from '@/lib/data/orders';
import { mockVendors } from '@/lib/data/vendors';
import { mockProducts } from '@/lib/data/products';
import { mockUsers } from '@/lib/data/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sprout, Menu, LogOut, TrendingUp, TrendingDown, BarChart3, PieChart, LineChart as LineChartIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminAnalytics() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Calculate analytics
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = mockOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completedOrders = mockOrders.filter(o => o.status === 'delivered').length;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  // Revenue by vendor
  const revenueByVendor = mockVendors.map(vendor => {
    const vendorOrders = mockOrders.filter(o => o.vendorId === vendor.id);
    const revenue = vendorOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      name: vendor.name,
      revenue: parseFloat(revenue.toFixed(2)),
      orders: vendorOrders.length,
    };
  });

  // Order status distribution
  const statusDistribution = [
    { name: 'Delivered', value: mockOrders.filter(o => o.status === 'delivered').length, fill: '#10b981' },
    { name: 'Processing', value: mockOrders.filter(o => o.status === 'processing').length, fill: '#8b5cf6' },
    { name: 'Shipped', value: mockOrders.filter(o => o.status === 'shipped').length, fill: '#06b6d4' },
    { name: 'Pending', value: mockOrders.filter(o => o.status === 'pending').length, fill: '#eab308' },
    { name: 'Cancelled', value: mockOrders.filter(o => o.status === 'cancelled').length, fill: '#ef4444' },
  ].filter(s => s.value > 0);

  // Daily orders trend
  const dailyOrders = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const count = Math.floor(Math.random() * 15) + 5;
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      orders: count,
      revenue: parseFloat((count * (Math.random() * 300 + 200)).toFixed(2)),
    };
  });

  // Top products
  const topProducts = mockProducts
    .map(product => ({
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 10,
      revenue: parseFloat((product.price * (Math.floor(Math.random() * 100) + 10)).toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // User metrics
  const totalUsers = mockUsers.length;
  const buyerCount = mockUsers.filter(u => u.role === 'buyer').length;
  const farmerCount = mockUsers.filter(u => u.role === 'farmer').length;

  // Vendor metrics
  const totalVendors = mockVendors.length;
  const verifiedVendors = mockVendors.filter(v => v.verified).length;
  const avgVendorRating = (mockVendors.reduce((sum, v) => sum + v.rating, 0) / totalVendors).toFixed(1);

  if (!user || user.role !== 'admin') {
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
              <Link href="/admin/orders" className="text-foreground hover:text-primary transition-colors">
                Orders
              </Link>
              <Link href="/admin/analytics" className="text-primary font-medium">
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
              <Link href="/admin/dashboard" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Dashboard
              </Link>
              <Link href="/admin/vendors" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Vendors
              </Link>
              <Link href="/admin/orders" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                Orders
              </Link>
              <Link href="/admin/analytics" className="block px-4 py-2 text-primary font-medium">
                Analytics
              </Link>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Platform Analytics</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights into marketplace performance and trends
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold"><span className="text-xs">Ksh </span>{totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">{totalOrders}</p>
              <p className="text-xs text-blue-600 mt-2">Avg: ${avgOrderValue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold">{completionRate}%</p>
              <p className="text-xs text-muted-foreground mt-2">{completedOrders} completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Platform Users</p>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold">{totalUsers}</p>
              <p className="text-xs text-muted-foreground mt-2">{buyerCount} buyers, {farmerCount} farmers</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Daily Orders Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5" />
                  Daily Orders Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="var(--primary)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--primary)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Order Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Revenue by Vendor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Revenue by Vendor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueByVendor.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--primary)" name="Revenue ($)" />
                  <Bar dataKey="orders" fill="var(--accent)" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid with Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <p className="font-bold"><span className="text-xs">Ksh </span>{product.revenue.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vendor Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Vendor Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Total Vendors</p>
                      <p className="text-2xl font-bold">{totalVendors}</p>
                    </div>
                    <p className="text-xs text-green-600">{verifiedVendors} verified ({Math.round((verifiedVendors / totalVendors) * 100)}%)</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Avg Vendor Rating</p>
                      <p className="text-2xl font-bold">⭐ {avgVendorRating}</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(parseFloat(avgVendorRating) / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Response Time: &lt;2h avg</Badge>
                    <Badge variant="outline">Success Rate: 97%</Badge>
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
