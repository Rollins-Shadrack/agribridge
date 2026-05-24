"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Sprout} from "lucide-react";
import Link from "next/link";
import LoginButton from "@/components/auth-button";

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


  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
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
          <motion.div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" variants={itemVariants}>
            {/* Buyer Role */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mb-3" />
                  <CardTitle>Buyer</CardTitle>
                  <CardDescription>Browse & order fresh produce</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Discover premium fresh produce from verified local farmers. Order with confidence.</p>
                  <LoginButton role="buyer"/>
                </CardContent>
              </Card>
            </motion.div>

            {/* Farmer Role */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Sprout className="w-10 h-10 text-primary mb-3" />
                  <CardTitle>Farmer</CardTitle>
                  <CardDescription>Manage listings & orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Sell your fresh produce directly to customers. Track orders and build your reputation.</p>
                  <LoginButton role="farmer"/>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Role */}
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedRole("admin")} className="cursor-pointer">
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
            </motion.div> */}
          </motion.div>
      

        {/* Footer */}
        <motion.div className="text-center mt-12 text-sm text-muted-foreground" variants={itemVariants}>
          <p>Return to <Link href="/" className="text-primary" >Marketplace</Link></p>
        </motion.div>
      </motion.div>
    </div>
  );
}
