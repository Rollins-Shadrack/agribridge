'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockVendors } from '@/lib/data/vendors';
import { Vendor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sprout, Menu, LogOut, Search, CheckCircle2, XCircle, Eye, Trash2, MessageSquare } from 'lucide-react';
import { useState as useStateModal } from 'react';

export default function AdminVendors() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Filter vendors based on search and verification status
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterVerified === 'all' ||
                         (filterVerified === 'verified' && vendor.verified) ||
                         (filterVerified === 'unverified' && !vendor.verified);
    return matchesSearch && matchesFilter;
  });

  const handleVerifyVendor = (vendorId: string) => {
    setVendors(vendors.map(v => 
      v.id === vendorId 
        ? { ...v, verified: true, verificationDate: new Date().toISOString() }
        : v
    ));
  };

  const handleRejectVendor = (vendorId: string) => {
    setVendors(vendors.map(v =>
      v.id === vendorId
        ? { ...v, verified: false }
        : v
    ));
  };

  const handleDeleteVendor = (vendorId: string) => {
    setVendors(vendors.filter(v => v.id !== vendorId));
  };

  const openVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDetailModal(true);
  };

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
              <Link href="/admin/vendors" className="text-primary font-medium">
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
              <Link href="/admin/vendors" className="block px-4 py-2 text-primary font-medium">
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
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Vendor Management</h1>
          <p className="text-lg text-muted-foreground">
            Approve, verify, and manage farmers and vendors on the platform
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Vendors</p>
              <p className="text-3xl font-bold">{vendors.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Verified</p>
              <p className="text-3xl font-bold text-green-600">{vendors.filter(v => v.verified).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{vendors.filter(v => !v.verified).length}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-card border border-border rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vendors by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterVerified('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterVerified === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                All Vendors
              </button>
              <button
                onClick={() => setFilterVerified('verified')}
                className={`px-4 py-2 rounded-lg font-medium transition-all gap-2 flex items-center ${
                  filterVerified === 'verified'
                    ? 'bg-green-600 text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </button>
              <button
                onClick={() => setFilterVerified('unverified')}
                className={`px-4 py-2 rounded-lg font-medium transition-all gap-2 flex items-center ${
                  filterVerified === 'unverified'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Pending
              </button>
            </div>
          </div>
        </motion.div>

        {/* Vendors Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredVendors.length > 0 ? (
            <div className="space-y-4">
              {filteredVendors.map((vendor, idx) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="text-3xl">{vendor.avatarEmoji || '🚜'}</div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-foreground">{vendor.name}</h3>
                              <p className="text-sm text-muted-foreground">{vendor.location}</p>
                            </div>
                          </div>

                          <p className="text-sm text-foreground mb-3">{vendor.description}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {vendor.verified ? (
                              <Badge className="bg-green-600">✓ Verified</Badge>
                            ) : (
                              <Badge className="bg-yellow-600">⚠ Pending Review</Badge>
                            )}
                            <Badge variant="outline">{vendor.specialty}</Badge>
                            <Badge variant="outline">Rating: {vendor.rating}</Badge>
                            <Badge variant="outline">{vendor.reviewCount} reviews</Badge>
                          </div>

                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Response Time: {vendor.responseTime}h | Success Rate: {vendor.successRate}%</p>
                            <p>Member Since: {new Date(vendor.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:min-w-fit">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openVendorDetails(vendor)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>

                          {!vendor.verified ? (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 gap-2"
                                onClick={() => handleVerifyVendor(vendor.id)}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectVendor(vendor.id)}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectVendor(vendor.id)}
                            >
                              Unverify
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteVendor(vendor.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No vendors found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Vendor Details Modal */}
      {showDetailModal && selectedVendor && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowDetailModal(false)}
        >
          <motion.div
            className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{selectedVendor.name}</h2>
                <p className="text-muted-foreground">{selectedVendor.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{selectedVendor.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Rating</p>
                  <p className="font-medium">⭐ {selectedVendor.rating} ({selectedVendor.reviewCount} reviews)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Response Time</p>
                  <p className="font-medium">{selectedVendor.responseTime} hours</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                  <p className="font-medium">{selectedVendor.successRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-medium">{selectedVendor.verified ? '✓ Verified' : '⚠ Pending'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                  <p className="font-medium">{new Date(selectedVendor.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </Button>
                <Button
                  className="gap-2"
                  disabled
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Vendor
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
