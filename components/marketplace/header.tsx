"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sprout, ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export function MarketplaceHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sprout className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-foreground hidden sm:inline">AgriBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              Browse
            </Link>
            {user?.role === "buyer" && (
              <Link href="/orders" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                My Orders
              </Link>
            )}
            {user?.role === "farmer" && (
              <>
                <Link href="/farmer/dashboard" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/farmer/orders" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                  Orders
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link href="/admin/dashboard" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart - Only show when logged in as buyer */}
            {user?.role === "buyer" && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                  {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>}
                </Link>
              </motion.div>
            )}

            {/* User Menu or Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {user?.image ? <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" /> : <User className="w-5 h-5" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role === "buyer" && (
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="gap-2">
                <Link href="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div className="md:hidden border-t border-border py-4 space-y-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded font-medium">
              Browse
            </Link>
            {user?.role === "buyer" && (
              <Link href="/orders" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded">
                My Orders
              </Link>
            )}
            {user && (
              <>
                <DropdownMenuSeparator />
                <Button variant="ghost" className="w-full justify-start px-4 text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
