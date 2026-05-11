"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { mockUsers } from "@/lib/data/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Sprout, Shield, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (userId: string) => {
    setIsLoading(true);
    loginAs(userId);
    router.push("/");
  };

  const buyerUsers = mockUsers.filter((u) => u.role === "buyer");
  const farmerUsers = mockUsers.filter((u) => u.role === "farmer");
  const adminUsers = mockUsers.filter((u) => u.role === "admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div className="w-full max-w-6xl" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">AgriBridge</h1>
          </div>
          <p className="text-lg text-muted-foreground">Connect directly with local farmers for fresh produce</p>
        </motion.div>

        {/* Role Selection */}
        {selectedRole === null ? (
          <motion.div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto" variants={itemVariants}>
            {/* Buyer Role */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedRole("buyer")} className="cursor-pointer">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mb-3" />
                  <CardTitle>Buyer</CardTitle>
                  <CardDescription>Browse & order fresh produce</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Discover premium fresh produce from verified local farmers. Order with confidence.</p>
                  <Button variant="outline" className="w-full">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Farmer Role */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedRole("farmer")} className="cursor-pointer">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Sprout className="w-10 h-10 text-primary mb-3" />
                  <CardTitle>Farmer</CardTitle>
                  <CardDescription>Manage listings & orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Sell your fresh produce directly to customers. Track orders and build your reputation.</p>
                  <Button variant="outline" className="w-full">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Role */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedRole("admin")} className="cursor-pointer">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Shield className="w-10 h-10 text-primary mb-3" />
                  <CardTitle>Admin</CardTitle>
                  <CardDescription>Manage marketplace</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Monitor marketplace activity, vendors, and ensure quality standards.</p>
                  <Button variant="outline" className="w-full">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          /* User Selection */
          <motion.div className="max-w-4xl mx-auto" variants={itemVariants} key={selectedRole}>
            <Button variant="ghost" onClick={() => setSelectedRole(null)} className="mb-6">
              ← Back to roles
            </Button>

            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {selectedRole === "buyer" && "Select a Buyer Account"}
              {selectedRole === "farmer" && "Select a Farmer Account"}
              {selectedRole === "admin" && "Select an Admin Account"}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedRole === "buyer" ? buyerUsers : selectedRole === "farmer" ? farmerUsers : adminUsers).map((user) => (
                <motion.div key={user.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        {user.avatar && <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />}
                        <h3 className="font-semibold mb-1">{user.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                        <Button onClick={() => handleLogin(user.id)} disabled={isLoading} className="w-full">
                          <LogIn className="w-4 h-4 mr-2" />
                          Login
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div className="text-center mt-12 text-sm text-muted-foreground" variants={itemVariants}>
          <p>Demo account login • No password required</p>
          <p>Return to <Link href="/" className="text-primary" >Marketplace</Link></p>
        </motion.div>
      </motion.div>
    </div>
  );
}
