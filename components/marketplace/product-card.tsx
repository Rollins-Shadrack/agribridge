"use client";

import Link from "next/link";
import { Product, Vendor } from "@/lib/types";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
  vendor?: Vendor;
  vendorName?: string;
  vendorVerified?: boolean;
}

export function ProductCard({ product, vendor, vendorName, vendorVerified }: ProductCardProps) {
  const { addItem } = useCart();

  const displayVendorName = vendor?.name || vendorName || "Unknown Vendor";
  const displayVendorVerified = vendor?.verified ?? vendor?.isVerified ?? vendorVerified ?? false;
  const isOutOfStock = product.quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

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
    <motion.div whileHover={{ y: isOutOfStock ? 0 : -4 }} whileTap={{ scale: isOutOfStock ? 1 : 0.98 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Link href={`/marketplace/product/${product.id}`} className="block">
        <div className={`h-full overflow-hidden border rounded-xl transition-colors group ${isOutOfStock ? "border-border/50 bg-muted/30" : "hover:border-primary/50 cursor-pointer"}`}>
          {/* Image */}
          <div className="relative overflow-hidden bg-muted h-48">
            <img src={product.image} alt={product.name} className={`w-full h-full rounded-md object-cover transition-transform duration-300 ${isOutOfStock ? "grayscale opacity-60" : "group-hover:scale-105"}`} />

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="bg-background/95 text-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg">Out of Stock</span>
              </div>
            )}

            {product.certification && (
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                {product.certification === "organic" && "🌿 Organic"}
                {product.certification === "fair-trade" && "⚖️ Fair Trade"}
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4">
            {/* Vendor Info */}
            <div className="flex items-center gap-1 mb-2">
              <p className="text-sm text-muted-foreground">{displayVendorName}</p>
              {displayVendorVerified && <BadgeCheck className="w-4 h-4 text-primary shrink-0" />}
            </div>

            {/* Product Name */}
            <h3 className={`font-semibold mb-2 line-clamp-2 min-h-10 ${isOutOfStock ? "text-muted-foreground" : "text-foreground"}`}>{product.name}</h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-10">{product.description}</p>

            {/* Price and Unit */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  <span className="text-xs">Ksh </span>
                  {product.price.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">per {product.unit}</p>
              </div>

              <div className="text-right">
                <p className={`text-xs ${isOutOfStock ? "text-destructive" : "text-muted-foreground"}`}>{isOutOfStock ? "Out of Stock" : "In Stock"}</p>
                <p className={`text-sm font-semibold ${isOutOfStock ? "text-destructive" : "text-primary"}`}>{product.quantity} available</p>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isOutOfStock) handleAddToCart(e);
              }}
              disabled={isOutOfStock}
              className="w-full gap-2"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? "Currently Unavailable" : "Add to Cart"}
            </Button>
          </CardContent>
        </div>
      </Link>
    </motion.div>
  );
}
