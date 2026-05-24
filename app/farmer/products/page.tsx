"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { mockProducts } from "@/lib/data/products";
import { mockVendors } from "@/lib/data/vendors";
import { Product } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, LogOut, Menu, X, Upload, Package, DollarSign, Leaf, Home } from "lucide-react";

export default function FarmerProducts() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    unit: "kg",
    category: "avocados",
    certification: "",
    image: "",
  });

  useEffect(() => {
    if (!user || user.role !== "farmer") {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    // Get vendor data for the current farmer
    const vendor = mockVendors.find((v) => v.name.includes("John") || v.name.includes("Lisa") || v.name.includes("Robert"));
    if (vendor) {
      const farmerProducts = mockProducts.filter((p) => p.vendorId === vendor.id);
      setProducts(farmerProducts);
    }
  }, []);

  if (!user || user.role !== "farmer") {
    return null;
  }

  const vendor = mockVendors.find((v) => v.name.includes("John") || v.name.includes("Lisa") || v.name.includes("Robert"));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        unit: product.unit,
        category: product.category,
        certification: product.certification || "",
        image: product.image,
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        unit: "kg",
        category: "avocados",
        certification: "",
        image: "",
      });
      setImagePreview("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      unit: "kg",
      category: "avocados",
      certification: "",
      image: "",
    });
    setImagePreview("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.quantity || !formData.image) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingProduct) {
      // Update product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                category: formData.category,
                certification: formData.certification,
                image: formData.image,
              }
            : p,
        ),
      );
    } else {
      // Create new product
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        category: formData.category,
        certification: formData.certification,
        image: formData.image,
        vendorId: vendor?.id || "vendor-1",
        createdAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }

    handleCloseModal();
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    setShowDeleteConfirm(null);
  };

  const categories = ["avocados", "vegetables", "fruits", "organic"];
  const certifications = ["organic", "fair-trade", "non-gmo", "pesticide-free"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/farmer/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-foreground hidden sm:inline">AgriBridge Farm</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/farmer/dashboard" className="text-sm text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/farmer/products" className="text-sm text-primary transition-colors font-medium flex items-center gap-2 border-b-2 border-primary pb-1">
                <Package className="w-4 h-4" />
                Products
              </Link>
              <Link href="/farmer/orders" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                Orders
              </Link>
              <Link href="/farmer/analytics" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button onClick={handleLogout} variant="ghost" size="icon" className="gap-2">
                <LogOut className="w-5 h-5" />
              </Button>

              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div className="md:hidden border-t border-border py-4 space-y-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/farmer/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded font-medium">
                Dashboard
              </Link>
              <Link href="/farmer/products" className="block px-4 py-2 text-sm text-primary hover:bg-muted rounded font-medium">
                Products
              </Link>
              <Link href="/farmer/orders" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded">
                Orders
              </Link>
              <Link href="/farmer/analytics" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded">
                Analytics
              </Link>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Products</h1>
            <p className="text-muted-foreground">
              Manage and list your farm produce. {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} listed.
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </motion.div>

        {/* Search Bar */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Inventory</p>
                  <p className="text-3xl font-bold">{products.reduce((sum, p) => sum + p.quantity, 0).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-1">units</p>
                </div>
                <Leaf className="w-8 h-8 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-3xl font-bold"><span className="text-xs">Ksh </span>{products.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <AnimatePresence>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div key={product.id} className="group" layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                    {/* Image */}
                    <div className="relative h-40 bg-muted overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 flex-1 flex flex-col">
                      {/* Title and Badges */}
                      <div className="mb-3">
                        <h3 className="font-bold text-lg line-clamp-1 mb-2">{product.name}</h3>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                          {product.certification && (
                            <Badge variant="outline" className="text-xs">
                              ✓ {product.certification}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{product.description}</p>

                      {/* Details */}
                      <div className="space-y-2 mb-4 pb-4 border-t border-border pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="font-semibold text-primary"><span className="text-xs">Ksh</span>{product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Stock</span>
                          <span className="font-semibold">
                            {product.quantity} {product.unit}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleOpenModal(product)}>
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1 gap-2" onClick={() => setShowDeleteConfirm(product.id)}>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delete Confirmation */}
                  <AnimatePresence>
                    {showDeleteConfirm === product.id && (
                      <motion.div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Card className="w-80 bg-background">
                          <CardHeader>
                            <CardTitle>Delete Product?</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">Are you sure you want to delete "{product.name}"? This action cannot be undone.</p>
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(null)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(product.id)}>
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div className="col-span-full py-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No products found" : "No products yet"}</h3>
                <p className="text-muted-foreground mb-4">{searchQuery ? "Try adjusting your search terms" : "Start by adding your first product to your farm"}</p>
                {!searchQuery && (
                  <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal}>
            <motion.div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <CardHeader className="border-b border-border sticky top-0 bg-background">
                <div className="flex items-center justify-between">
                  <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                  <button onClick={handleCloseModal} className="p-1 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name *</label>
                    <Input type="text" placeholder="e.g., Hass Avocados" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description *</label>
                    <textarea
                      placeholder="Describe your product, harvest details, taste profile..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Image *</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer" onClick={() => document.getElementById("imageInput")?.click()}>
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg mx-auto" />
                          <p className="text-sm text-muted-foreground">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Click to upload</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                      )}
                      <input id="imageInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                  </div>

                  {/* Price and Unit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price per Unit ($) *</label>
                      <Input type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Unit of Measurement *</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="lb">Pound (lb)</option>
                        <option value="bag">Bag</option>
                        <option value="bunch">Bunch</option>
                        <option value="case">Case</option>
                      </select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Available Quantity *</label>
                    <Input type="number" step="0.01" placeholder="0.00" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
                  </div>

                  {/* Category and Certification */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Certification</label>
                      <select
                        value={formData.certification}
                        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="">No certification</option>
                        {certifications.map((cert) => (
                          <option key={cert} value={cert}>
                            {cert.charAt(0).toUpperCase() + cert.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button type="button" variant="outline" className="flex-1" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
