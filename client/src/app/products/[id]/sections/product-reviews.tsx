"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Dummy reviews data
const reviews = [
  {
    id: 1,
    user: {
      name: "John Smith",
      avatar: "/avatars/avatar-1.png?height=40&width=40",
      verified: true,
    },
    rating: 5,
    title: "Excellent quality and sound!",
    content:
      "These headphones exceeded my expectations. The sound quality is amazing and the noise cancellation works perfectly. Very comfortable for long listening sessions.",
    date: "2024-01-15",
    helpful: 12,
    notHelpful: 1,
    images: ["/products/bag-1.png?height=100&width=100"],
  },
  {
    id: 2,
    user: {
      name: "Sarah Johnson",
      avatar: "/avatars/avatar-2.png?height=40&width=40",
      verified: true,
    },
    rating: 4,
    title: "Great value for money",
    content:
      "Really good headphones for the price. Battery life is as advertised and they're very comfortable. Only minor complaint is the case could be a bit smaller.",
    date: "2024-01-10",
    helpful: 8,
    notHelpful: 0,
    images: [],
  },
  {
    id: 3,
    user: {
      name: "Mike Chen",
      avatar: "/avatars/avatar-3.png?height=40&width=40",
      verified: false,
    },
    rating: 5,
    title: "Perfect for work calls",
    content:
      "The microphone quality is excellent for video calls. Colleagues say I sound very clear. The noise cancellation helps me focus in a busy office environment.",
    date: "2024-01-08",
    helpful: 15,
    notHelpful: 2,
    images: [],
  },
];

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  const ratingDistribution = [
    { stars: 5, count: 180, percentage: 75 },
    { stars: 4, count: 48, percentage: 20 },
    { stars: 3, count: 12, percentage: 5 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const averageRating = 4.8;
  const totalReviews = 240;

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <div className="text-muted-foreground">
                Based on {totalReviews} reviews
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{item.stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rating:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user.name}</span>
                    {review.user.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>

                  {/* Review Content */}
                  <div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-muted-foreground">{review.content}</p>
                  </div>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Review image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Buttons */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Was this helpful?
                    </span>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      Yes ({review.helpful})
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ThumbsDown className="h-3 w-3" />
                      No ({review.notHelpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Write Review */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <button key={i} className="p-1">
                    <Star className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Review Title
              </label>
              <input
                type="text"
                placeholder="Give your review a title"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Review
              </label>
              <Textarea
                placeholder="Tell others about your experience with this product"
                rows={4}
              />
            </div>

            <Button>Submit Review</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
