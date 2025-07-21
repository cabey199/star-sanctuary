import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  Users,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Share2,
  Flag,
  MoreHorizontal,
} from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  serviceBooked: string;
  helpful: number;
  response?: {
    from: string;
    message: string;
    date: string;
  };
  images?: string[];
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: number;
  recommendationRate: number;
}

interface PublicReviewsProps {
  businessSlug: string;
  showTitle?: boolean;
  maxReviews?: number;
  layout?: "compact" | "detailed" | "carousel";
  enableFiltering?: boolean;
  enableSharing?: boolean;
}

const PublicReviews: React.FC<PublicReviewsProps> = ({
  businessSlug,
  showTitle = true,
  maxReviews = 6,
  layout = "detailed",
  enableFiltering = true,
  enableSharing = false,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = layout === "carousel" ? 1 : maxReviews;

  // Mock data - in real implementation, this would fetch from API
  useEffect(() => {
    const mockReviews: Review[] = [
      {
        id: "1",
        customerName: "Sarah Johnson",
        customerAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b2a41b33?w=150",
        rating: 5,
        title: "Exceptional Service!",
        comment:
          "Absolutely amazing experience! The staff was professional, friendly, and really took their time to ensure I was completely satisfied. The results exceeded my expectations. I'll definitely be coming back and recommending this place to all my friends.",
        date: "2024-01-20",
        verified: true,
        serviceBooked: "Premium Haircut & Styling",
        helpful: 12,
        response: {
          from: "Elite Barber Shop",
          message:
            "Thank you so much for your wonderful review, Sarah! We're thrilled that you had such a great experience with us. We look forward to seeing you again soon!",
          date: "2024-01-21",
        },
      },
      {
        id: "2",
        customerName: "Michael Chen",
        customerAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "Best Barber in Town",
        comment:
          "I've been to many barbers, but this place is simply the best. Attention to detail is incredible, and they really listen to what you want. The atmosphere is great too - modern, clean, and welcoming.",
        date: "2024-01-18",
        verified: true,
        serviceBooked: "Classic Beard Trim",
        helpful: 8,
        images: [
          "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300",
        ],
      },
      {
        id: "3",
        customerName: "Emma Rodriguez",
        customerAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 4,
        title: "Great Experience",
        comment:
          "Really happy with my visit! The service was excellent and the staff made me feel comfortable throughout. Only minor issue was the wait time, but the quality of work made it worth it.",
        date: "2024-01-15",
        verified: true,
        serviceBooked: "Spa Relaxation Package",
        helpful: 5,
      },
      {
        id: "4",
        customerName: "David Thompson",
        customerAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 5,
        title: "Outstanding Quality",
        comment:
          "Phenomenal work! I was nervous about trying a new place, but they made me feel at ease immediately. The final result was better than I imagined. Highly recommend!",
        date: "2024-01-12",
        verified: true,
        serviceBooked: "Premium Haircut & Styling",
        helpful: 15,
        response: {
          from: "Elite Barber Shop",
          message:
            "David, we're so glad we could exceed your expectations! Thank you for trusting us with your hair. See you next time!",
          date: "2024-01-13",
        },
      },
      {
        id: "5",
        customerName: "Lisa Park",
        customerAvatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        rating: 4,
        title: "Very Professional",
        comment:
          "Clean facility, professional staff, and good results. The booking process was smooth and they were very accommodating with my schedule. Will definitely return.",
        date: "2024-01-10",
        verified: true,
        serviceBooked: "Deep Cleansing Facial",
        helpful: 3,
      },
      {
        id: "6",
        customerName: "James Wilson",
        customerAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 5,
        title: "Exceeded Expectations",
        comment:
          "From booking to finish, everything was perfect. They took the time to understand exactly what I wanted and delivered flawlessly. The attention to detail is remarkable.",
        date: "2024-01-08",
        verified: true,
        serviceBooked: "Executive Grooming Package",
        helpful: 9,
      },
    ];

    const mockStats: ReviewStats = {
      averageRating: 4.7,
      totalReviews: 156,
      ratingDistribution: {
        5: 102,
        4: 32,
        3: 15,
        2: 5,
        1: 2,
      },
      recentReviews: 12,
      recommendationRate: 96,
    };

    setReviews(mockReviews);
    setStats(mockStats);
    setLoading(false);
  }, [businessSlug]);

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReviews = reviews
    .filter(
      (review) => filterRating === "all" || review.rating === filterRating,
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const paginatedReviews =
    layout === "carousel"
      ? [filteredReviews[currentPage]]
      : filteredReviews.slice(0, maxReviews);

  const totalPages = layout === "carousel" ? filteredReviews.length : 1;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && stats && (
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Customer Reviews
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              See what our customers are saying about their experiences
            </p>
          </div>

          {/* Review Stats */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-bold text-yellow-500">
                  {stats.averageRating}
                </span>
                {renderStars(Math.round(stats.averageRating), "lg")}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Based on {stats.totalReviews} reviews
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.recommendationRate}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recommend us
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.recentReviews}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This month
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="max-w-md mx-auto space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {
                    stats.ratingDistribution[
                      rating as keyof typeof stats.ratingDistribution
                    ]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {enableFiltering && (
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterRating.toString()}
              onValueChange={(value) =>
                setFilterRating(value === "all" ? "all" : parseInt(value))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Badge variant="outline" className="flex items-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            {filteredReviews.length} reviews
          </Badge>
        </div>
      )}

      {/* Reviews */}
      <div className={layout === "compact" ? "space-y-3" : "space-y-6"}>
        {paginatedReviews.filter(Boolean).map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className={layout === "compact" ? "p-4" : "p-6"}>
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      className={layout === "compact" ? "h-8 w-8" : "h-12 w-12"}
                    >
                      <AvatarImage
                        src={review.customerAvatar}
                        alt={review.customerName}
                      />
                      <AvatarFallback>
                        {review.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {review.customerName}
                        </h4>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating, "sm")}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {enableSharing && (
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Review Content */}
                <div className="space-y-3">
                  {layout !== "compact" && (
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">
                      {review.title}
                    </h5>
                  )}

                  <p
                    className={`text-gray-700 dark:text-gray-300 ${layout === "compact" ? "text-sm line-clamp-2" : ""}`}
                  >
                    {review.comment}
                  </p>

                  {review.serviceBooked && (
                    <Badge variant="secondary" className="text-xs">
                      Service: {review.serviceBooked}
                    </Badge>
                  )}

                  {review.images &&
                    review.images.length > 0 &&
                    layout !== "compact" && (
                      <div className="flex space-x-2">
                        {review.images.map((image, idx) => (
                          <img
                            key={idx}
                            src={image}
                            alt={`Review image ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                </div>

                {/* Business Response */}
                {review.response && layout !== "compact" && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <h6 className="font-medium text-sm text-blue-600 dark:text-blue-400">
                        Response from {review.response.from}
                      </h6>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.response.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {review.response.message}
                    </p>
                  </div>
                )}

                {/* Review Actions */}
                {layout !== "compact" && (
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 hover:text-blue-600">
                        <ThumbsUp className="h-3 w-3" />
                        <span>Helpful ({review.helpful})</span>
                      </button>

                      {enableSharing && (
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <Share2 className="h-3 w-3" />
                          <span>Share</span>
                        </button>
                      )}
                    </div>

                    <button className="flex items-center space-x-1 hover:text-red-600">
                      <Flag className="h-3 w-3" />
                      <span>Report</span>
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Carousel Navigation */}
      {layout === "carousel" && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Load More / View All */}
      {layout !== "carousel" && filteredReviews.length > maxReviews && (
        <div className="text-center">
          <Button variant="outline">
            View All {filteredReviews.length} Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublicReviews;
