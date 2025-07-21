import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Eye,
  EyeOff,
  Check,
  X,
  Calendar,
  User,
  Filter,
  Download,
  Share2,
} from "lucide-react";
import { BookingReview, PublicReview } from "../../shared/types";

interface ReviewSystemProps {
  businessId: string;
  mode: "customer" | "business" | "public";
  bookingId?: string; // For customer review submission
  showPublicReviews?: boolean;
}

interface ReviewFormData {
  rating: number;
  comment: string;
  reviewerName: string;
}

interface ReviewFilters {
  rating: string;
  dateRange: string;
  approved: string;
}

export default function ReviewSystem({
  businessId,
  mode,
  bookingId,
  showPublicReviews = true,
}: ReviewSystemProps) {
  const [reviews, setReviews] = useState<BookingReview[]>([]);
  const [publicReviews, setPublicReviews] = useState<PublicReview[]>([]);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    comment: "",
    reviewerName: "",
  });
  const [filters, setFilters] = useState<ReviewFilters>({
    rating: "all",
    dateRange: "all",
    approved: "all",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  useEffect(() => {
    if (mode === "public" && showPublicReviews) {
      fetchPublicReviews();
    } else if (mode === "business") {
      fetchBusinessReviews();
    }
    fetchReviewStats();
  }, [businessId, mode, showPublicReviews]);

  const fetchPublicReviews = async () => {
    try {
      const response = await fetch(
        `/api/businesses/${businessId}/reviews/public`,
      );
      if (response.ok) {
        const data = await response.json();
        setPublicReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to fetch public reviews:", err);
    }
  };

  const fetchBusinessReviews = async () => {
    try {
      const response = await fetch(`/api/businesses/${businessId}/reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("clientAuthToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to fetch business reviews:", err);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await fetch(
        `/api/businesses/${businessId}/reviews/stats`,
      );
      if (response.ok) {
        const data = await response.json();
        setReviewStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch review stats:", err);
    }
  };

  const submitReview = async () => {
    if (!bookingId) {
      setError("Booking ID is required");
      return;
    }

    if (!reviewForm.comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    if (!reviewForm.reviewerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/bookings/${bookingId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
          reviewerName: reviewForm.reviewerName.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(
          "Thank you for your review! It has been submitted for approval.",
        );
        setShowReviewForm(false);
        setReviewForm({
          rating: 5,
          comment: "",
          reviewerName: "",
        });
      } else {
        setError(result.message || "Failed to submit review");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReviewApproval = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("clientAuthToken")}`,
        },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId ? { ...review, approved } : review,
          ),
        );
        setSuccess(`Review ${approved ? "approved" : "rejected"} successfully`);
      }
    } catch (err) {
      setError("Failed to update review approval");
    }
  };

  const toggleReviewVisibility = async (
    reviewId: string,
    isPublic: boolean,
  ) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("clientAuthToken")}`,
        },
        body: JSON.stringify({ isPublic }),
      });

      if (response.ok) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId ? { ...review, isPublic } : review,
          ),
        );
        setSuccess(`Review visibility updated successfully`);
      }
    } catch (err) {
      setError("Failed to update review visibility");
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    const total = reviewStats.totalReviews;
    if (total === 0) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            reviewStats.ratingDistribution[
              rating as keyof typeof reviewStats.ratingDistribution
            ];
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-8">{rating}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-12 text-gray-600">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    if (
      filters.rating !== "all" &&
      review.rating !== parseInt(filters.rating)
    ) {
      return false;
    }
    if (filters.approved !== "all") {
      const isApproved = filters.approved === "approved";
      if (review.approved !== isApproved) {
        return false;
      }
    }
    return true;
  });

  // Customer Review Form
  if (mode === "customer") {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Rate Your Experience</CardTitle>
          <CardDescription>
            Your feedback helps us improve our services
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {!success && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input
                  value={reviewForm.reviewerName}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      reviewerName: e.target.value,
                    }))
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex justify-center">
                  {renderStars(reviewForm.rating, true, (rating) =>
                    setReviewForm((prev) => ({ ...prev, rating })),
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your Review</Label>
                <Textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  placeholder="Tell us about your experience..."
                  rows={4}
                />
              </div>

              <Button
                onClick={submitReview}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Public Reviews Display
  if (mode === "public") {
    return (
      <div className="space-y-6">
        {/* Reviews Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(reviewStats.averageRating))}
                </div>
                <p className="text-gray-600">
                  Based on {reviewStats.totalReviews} reviews
                </p>
              </div>
              <div>{renderRatingDistribution()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Public Reviews List */}
        {publicReviews.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Reviews</h3>
            {publicReviews.slice(0, 5).map((review) => (
              <Card key={review.id} className="border-l-4 border-l-yellow-400">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium">
                          {review.reviewerName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {review.serviceName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{review.comment}</p>
                </CardContent>
              </Card>
            ))}

            {publicReviews.length > 5 && (
              <Button variant="outline" className="w-full">
                View All Reviews ({publicReviews.length})
              </Button>
            )}
          </div>
        )}

        {publicReviews.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews yet</p>
              <p className="text-sm text-gray-500">
                Be the first to leave a review!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Business Review Management
  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Review Management
          </CardTitle>
          <CardDescription>
            Manage customer reviews and ratings for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(reviewStats.averageRating))}
              </div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {reviewStats.totalReviews}
              </div>
              <p className="text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {reviews.filter((r) => r.approved).length}
              </div>
              <p className="text-gray-600">Approved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <select
                value={filters.rating}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, rating: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Approval Status</Label>
              <select
                value={filters.approved}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, approved: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Reviews</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Approval</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 3 Months</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {review.reviewerName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          ({review.rating})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">{review.comment}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          variant={review.approved ? "default" : "secondary"}
                        >
                          {review.approved ? "Approved" : "Pending"}
                        </Badge>
                        {review.approved && (
                          <div className="flex items-center gap-1">
                            {review.isPublic ? (
                              <Eye className="w-3 h-3 text-green-600" />
                            ) : (
                              <EyeOff className="w-3 h-3 text-gray-400" />
                            )}
                            <span className="text-xs text-gray-600">
                              {review.isPublic ? "Public" : "Private"}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleReviewApproval(review.id, !review.approved)
                          }
                        >
                          {review.approved ? (
                            <X className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                        {review.approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toggleReviewVisibility(
                                review.id,
                                !review.isPublic,
                              )
                            }
                          >
                            {review.isPublic ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews found</p>
              <p className="text-sm text-gray-500">
                Reviews will appear here once customers start leaving feedback
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
