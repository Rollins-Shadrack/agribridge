'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { mockProducts } from '@/lib/data/products';
import { mockVendors } from '@/lib/data/vendors';
import { mockReviews } from '@/lib/data/reviews';
import { useCart } from '@/lib/cart-context';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Star, BadgeCheck, Leaf, TrendingUp } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productId = params.id as string;
  const product = mockProducts.find(p => p.id === productId);
  const vendor = product ? mockVendors.find(v => v.id === product.vendorId) : null;
  const productReviews = product ? mockReviews.filter(r => r.vendorId === product.vendorId) : [];

  if (!product || !vendor) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        vendorId: product.vendorId,
        productName: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
    }
  };

  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          whileHover={{ x: -4 }}
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Marketplace
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-lg overflow-hidden bg-muted h-96 lg:h-[500px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.certification && (
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  {product.certification === 'organic' && 'Organic Certified'}
                  {product.certification === 'fair-trade' && 'Fair Trade'}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            {/* Vendor Info */}
            <Link href={`/marketplace/vendor/${vendor.id}`}>
              <Card className="mb-6 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-4">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                      {vendor.verified && <BadgeCheck className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {vendor.rating} ({vendor.reviewCount} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{vendor.location}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Product Details */}
            <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

            {/* Price and Stock */}
            <div className="mb-6">
              <div className="text-5xl font-bold text-primary mb-2">
                <span className="text-xs">Ksh</span>{product.price.toFixed(2)}
              </div>
              <p className="text-lg text-muted-foreground mb-4">per {product.unit}</p>
              <p className={`text-sm font-medium ${product.quantity > 0 ? 'text-primary' : 'text-destructive'}`}>
                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium text-foreground">Quantity:</label>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-foreground hover:bg-muted transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-foreground font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="px-3 py-2 text-foreground hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="w-full h-12 text-lg gap-2 mb-4"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Response Time</p>
                  <p className="text-lg font-semibold text-foreground">{vendor.responseTime}h</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-lg font-semibold text-foreground">{vendor.successRate}%</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {productReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  Customer Reviews ({avgRating})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productReviews.slice(0, 3).map(review => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
