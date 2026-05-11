'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockProducts } from '@/lib/data/products';
import { mockVendors } from '@/lib/data/vendors';
import { mockCategories } from '@/lib/data/categories';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { MarketplaceHero } from '@/components/marketplace/hero';
import { ProductCard } from '@/components/marketplace/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

export default function MarketplacePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVerified, setSelectedVerified] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('price-asc');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    let results = [...mockProducts];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter(p => p.category === selectedCategory);
    }

    // Verified vendors filter
    if (selectedVerified) {
      results = results.filter(p => {
        const vendor = mockVendors.find(v => v.id === p.vendorId);
        return vendor?.verified;
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      results.sort((a, b) => {
        const vendorA = mockVendors.find(v => v.id === a.vendorId);
        const vendorB = mockVendors.find(v => v.id === b.vendorId);
        return (vendorB?.rating || 0) - (vendorA?.rating || 0);
      });
    }

    return results;
  }, [searchQuery, selectedCategory, selectedVerified, sortBy]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <MarketplaceHero />

      {/* Search and Filters Section */}
      <section className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground"
              >
                <option value="">All Categories</option>
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Verified Vendors Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Vendor Type</label>
              <select
                value={selectedVerified ? 'verified' : 'all'}
                onChange={(e) => setSelectedVerified(e.target.value === 'verified')}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground"
              >
                <option value="all">All Vendors</option>
                <option value="verified">Verified Only</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || selectedVerified) && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedVerified(false);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {selectedCategory ? `${mockCategories.find(c => c.id === selectedCategory)?.name}` : 'All Products'}
          </h2>
          <p className="text-muted-foreground">
            {filteredProducts.length} products found
          </p>
        </motion.div>

        {filteredProducts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map(product => {
              const vendor = mockVendors.find(v => v.id === product.vendorId);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  vendorName={vendor?.name || 'Unknown Vendor'}
                  vendorVerified={vendor?.verified}
                />
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground mb-4">No products found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedVerified(false);
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
