'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Vendor } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

interface ProductCardProps {
  product: Product;
  vendor?: Vendor;
  vendorName?: string;
  vendorVerified?: boolean;
}

export function ProductCard({ product, vendor, vendorName, vendorVerified }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();

  const displayVendorName = vendor?.name || vendorName || 'Unknown Vendor';
  const displayVendorVerified = vendor?.verified ?? vendor?.isVerified ?? vendorVerified ?? false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'buyer') {
      router.push('/login');
      return;
    }

    addItem({
      productId: product.id,
      vendorId: product.vendorId,
      productName: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/marketplace/product/${product.id}`}>
        <Card className="h-full overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
          {/* Image */}
          <div className="relative overflow-hidden bg-muted h-48">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.certification && (
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                {product.certification === 'organic' && '🌿 Organic'}
                {product.certification === 'fair-trade' && '⚖️ Fair Trade'}
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4">
            {/* Vendor Info */}
            <div className="flex items-center gap-1 mb-2">
              <p className="text-sm text-muted-foreground">{displayVendorName}</p>
              {displayVendorVerified && (
                <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>

            {/* Price and Unit */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground"><span className="text-xs">Ksh </span>{product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">per {product.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">In stock</p>
                <p className="text-sm font-semibold text-primary">{product.quantity} available</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full gap-2"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
