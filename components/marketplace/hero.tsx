'use client';

import { motion } from 'framer-motion';
import { Leaf, Truck, Shield } from 'lucide-react';

export function MarketplaceHero() {
  const features = [
    {
      icon: Leaf,
      title: 'Farm Fresh',
      description: 'Direct from local farmers to your door',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: '24-hour delivery to your location',
    },
    {
      icon: Shield,
      title: 'Verified Farmers',
      description: 'Trusted and certified producers',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Fresh Produce,{' '}
            <span className="text-primary">Straight from Farms</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Connect directly with local farmers and get premium quality produce delivered to your door. 
            Support local agriculture while enjoying the freshest fruits, vegetables, and more.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
