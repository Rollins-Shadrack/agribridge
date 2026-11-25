"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketplaceHeader } from "@/components/marketplace/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/marketplace/product-card";
import { mockProducts } from "@/lib/data/products";
import { mockVendors } from "@/lib/data/vendors";
import { Search, Leaf, TrendingUp, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const year = new Date().getFullYear();

  const categories = [
    { id: "avocados", name: "Avocados", icon: "🥑" },
    { id: "vegetables", name: "Vegetables", icon: "🥬" },
    { id: "fruits", name: "Fruits", icon: "🍎" },
    { id: "organic", name: "Organic", icon: "🌿" },
    { id: "grains", name: "Grains", icon: "🥬" },
  ];

  // Get featured products (first 8)
  const featuredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const topVendors = mockVendors.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      {/* Hero Section */}
      <motion.section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-background via-background to-muted/20 py-16 sm:py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Hero Content */}
          <motion.div className="md:col-span-3 space-y-8 my-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Fresh Produce,
                <span className="text-primary block">Straight from Farmers</span>
              </h1>

              <p className="text-foreground/70 text-sm sm:text-base max-w-xl">Discover premium quality avocados, vegetables, and fruits from local farmers. Support sustainable agriculture while enjoying the freshest produce delivered to your door.</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 items-start">
              <Button size="lg" className="gap-2" asChild>
                <Link href="#products">
                  <Zap className="w-5 h-5" />
                  Shop Now
                </Link>
              </Button>

              <Button size="lg" variant="outline">
                Learn About Farmers
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-border">
              <motion.div variants={item} className="flex-1 min-w-35 space-y-2">
                <Award className="w-7 h-7 text-primary" />
                <p className="font-semibold">100% Fresh</p>
                <p className="text-xs text-muted-foreground">Harvested within 24 hours</p>
              </motion.div>

              <motion.div variants={item} className="flex-1 min-w-35 space-y-2">
                <TrendingUp className="w-7 h-7 text-primary" />
                <p className="font-semibold">Fair Prices</p>
                <p className="text-xs text-muted-foreground">Direct from farm to you</p>
              </motion.div>

              <motion.div variants={item} className="flex-1 min-w-35 space-y-2">
                <Leaf className="w-7 h-7 text-primary" />
                <p className="font-semibold">Sustainable</p>
                <p className="text-xs text-muted-foreground">Support local farmers</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Image Mosaic */}
          <div className="space-y-1 md:col-span-2">
            <div className="flex space-x-1 items-stretch">
              <div className="w-7/12">
                <Image src="/hero6.jpeg" width={446} height={446} alt="Fresh farm produce" className="object-cover h-72 w-full rounded-xl" />
              </div>

              <div className="w-5/12 self-end space-y-1">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <Image src="/hero5.jpeg" width={437} height={437} alt="Fresh vegetables" className="object-cover h-24 w-full rounded-xl" />
                  </div>

                  <div className="bg-primary rounded-xl rounded-tr-[100px]" />
                </div>

                <Image src="/hero4.jpeg" width={374} height={100} alt="Farm fresh fruits" className="object-cover w-full h-48 rounded-xl" />
              </div>
            </div>

            <div className="flex space-x-1">
              <div className="w-5/12 self-end space-y-1">
                <Image src="/hero2.jpeg" width={374} height={392} alt="Freshly harvested produce" className="object-cover w-full h-48 rounded-xl" />

                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-primary rounded-xl rounded-bl-[100px]" />

                  <div>
                    <Image src="/hero3.jpeg" alt="Fresh agricultural produce" width={394} height={394} className="object-cover w-full h-24 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="w-7/12">
                <Image src="/hero1.jpeg" width={446} height={446} alt="Farmers and fresh produce" className="object-cover w-full h-72 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Search & Filter Section */}
      <motion.section className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border py-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Search for products, farmers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"}`}>
                All Products
              </button>
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all gap-2 flex items-center ${selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"}`}>
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <Badge className="mb-4" variant="outline">
              Featured Products
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Fresh Quality</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Browse our carefully selected collection of farm-fresh products from verified farmers</p>
          </motion.div>

          {featuredProducts.length > 0 ? (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductCard product={product} vendor={mockVendors.find((v) => v.id === product.vendorId)!} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Farmers Section */}
      <motion.section className="py-16 md:py-24 bg-muted/50 border-y border-border" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <Badge className="mb-4" variant="outline">
              Featured Farmers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Farmers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Support local agriculture from the best verified farmers in your area</p>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {topVendors.map((vendor) => (
              <motion.div key={vendor.id} className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" variants={item} whileHover={{ y: -5 }}>
                <div className="text-4xl mb-4">{vendor.avatarEmoji}</div>
                <h3 className="font-bold text-lg mb-2">{vendor.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">{vendor.location}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{vendor.rating}</span>
                    <span className="text-sm text-muted-foreground">({vendor.reviewCount} reviews)</span>
                  </div>
                </div>
                {vendor.verified && (
                  <Badge className="w-full justify-center mb-4" variant="secondary">
                    ✓ Verified Farmer
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground text-center">{vendor.specialty}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section className="py-16 md:py-24" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Buying Fresh Today</h2>
          <p className="text-lg text-muted-foreground mb-8">Create an account to place orders and get exclusive deals from your favorite farmers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline">
              Continue Browsing
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MavunoFresh</h3>
              <p className="text-sm text-muted-foreground">Connecting farmers directly with consumers for fresh, sustainable produce.</p>
              <p className="text-sm text-muted-foreground">info@mavunofresh.co.ke</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© {year} MavunoFresh. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Facebook
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
