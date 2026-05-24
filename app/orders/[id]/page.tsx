'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { mockOrders } from '@/lib/data/orders';
import { mockVendors } from '@/lib/data/vendors';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Phone, Clock, Star, CheckCircle2, Circle } from 'lucide-react';

const statusSteps = [
  { key: 'awaiting_confirmation', label: 'Awaiting Confirmation' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const order = mockOrders.find(o => o.id === orderId);
  const vendor = order ? mockVendors.find(v => v.id === order.vendorId) : null;

  if (!order || !vendor) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Order not found</h1>
            <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);
  const isDelivered = order.status === 'delivered';

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/orders')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          whileHover={{ x: -4 }}
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Orders
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Order #{order.id}</h1>
          <p className="text-lg text-muted-foreground">
            Placed on {order.createdAt}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={step.key} className="flex gap-4">
                          {/* Timeline Dot */}
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </motion.div>
                            {idx < statusSteps.length - 1 && (
                              <div
                                className={`w-1 h-12 mt-2 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}
                              />
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="pb-6">
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 + 0.2 }}
                            >
                              <p
                                className={`font-semibold text-lg ${
                                  isCurrent
                                    ? 'text-primary'
                                    : isCompleted
                                      ? 'text-foreground'
                                      : 'text-muted-foreground'
                                }`}
                              >
                                {step.label}
                              </p>
                              {isCurrent && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Current status as of {order.updatedAt}
                                </p>
                              )}
                              {isCompleted && !isCurrent && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Completed on {order.updatedAt}
                                </p>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            <span className="text-xs">Ksh </span>{item.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="text-xs">Ksh </span>{item.pricePerUnit.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vendor Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.description}</p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <p className="font-semibold text-foreground">{vendor.rating}/5</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Response Time</p>
                        <p className="font-semibold text-foreground">{vendor.responseTime}h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="font-medium text-foreground">{order.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                  <p className="font-medium text-foreground">{order.deliveryDate}</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryTime}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-foreground">{order.phoneNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span><span className="text-xs">Ksh </span>{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax</span>
                  <span><span className="text-xs">Ksh </span>{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Delivery Fee</span>
                  <span><span className="text-xs">Ksh </span>{order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-lg text-primary">
                  <span>Total</span>
                  <span><span className="text-xs">Ksh </span>{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delivery Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Action Button */}
            {isDelivered && (
              <Button className="w-full" variant="outline">
                <Star className="w-4 h-4 mr-2" />
                Leave Review
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
