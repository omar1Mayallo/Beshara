"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    { icon: Truck, text: "Free Shipping" },
    { icon: Shield, text: "Secure Payment" },
    { icon: Headphones, text: "24/7 Support" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                🎉 New Collection Available
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your
                <span className="text-primary block">Perfect Style</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md">
                Shop the latest trends with unbeatable prices. Quality products,
                fast shipping, and exceptional service guaranteed.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  4.9/5 (2.1k reviews)
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Story
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8">
              <img
                src="/hero-1.png?height=600&width=500"
                alt="Hero Product"
                className="w-full h-auto max-w-md mx-auto"
              />

              {/* Floating Elements */}
              <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
                <Badge variant="destructive">-30%</Badge>
              </div>

              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">1.2k+ sold today</span>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full aspect-video">
            <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center">
              <p className="text-muted-foreground">
                Video player would go here
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
