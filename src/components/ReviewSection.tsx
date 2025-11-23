"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchReviews, submitReview, fetchUserReview, updateReview, deleteReview, Review, getAverageRating } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Star, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  contentId: string;
}

const StarRating: React.FC<{ rating: number; onRatingChange?: (rating: number) => void; editable?: boolean }> = ({
  rating,
  onRatingChange,
  editable = false,
}) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    return (
      <Star
        key={index}
        className={cn(
          "h-5 w-5",
          starValue <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
          editable && "cursor-pointer hover:fill-yellow-300 hover:text-yellow-300"
        )}
        onClick={() => editable && onRatingChange && onRatingChange(starValue)}
      />
    );
  });
  return <div className="flex space-x-1">{stars}</div>;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ contentId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedReviews = await fetchReviews(contentId);
      setReviews(fetchedReviews);

      const { averageRating: avg, reviewCount: count } = await getAverageRating(contentId) || { averageRating: 0, reviewCount: 0 };
      setAverageRating(avg);
      setReviewCount(count);

      if (isAuthenticated && user) {
        const existingUserReview = await fetchUserReview(user.id, contentId);
        setUserReview(existingUserReview);
        if (existingUserReview) {
          setNewReviewText(existingUserReview.review_text || "");
          setNewRating(existingUserReview.rating);
        } else {
          setNewReviewText("");
          setNewRating(0);
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contentId) {
      loadReviews();
    }
  }, [contentId, isAuthenticated, user]);

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user || newRating === 0) {
      toast.error("Please log in and provide a rating.");
      return;
    }

    setSubmitting(true);
    try {
      if (userReview) {
        // Update existing review
        await updateReview(userReview.id, newRating, newReviewText.trim() || null);
        toast.success("Review updated successfully!");
      } else {
        // Submit new review
        await submitReview(user.id, contentId, newRating, newReviewText.trim() || null);
        toast.success("Review posted successfully!");
      }
      setNewReviewText("");
      setNewRating(0);
      setIsEditing(false);
      loadReviews(); // Reload reviews to show the new/updated one
    } catch (err) {
      console.error("Failed to post/update review:", err);
      toast.error("Failed to post/update review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview || !confirm("Are you sure you want to delete your review?")) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteReview(userReview.id);
      toast.success("Review deleted successfully!");
      setUserReview(null);
      setNewReviewText("");
      setNewRating(0);
      setIsEditing(false);
      loadReviews(); // Reload reviews
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error("Failed to delete review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-heading font-bold mb-6 uppercase tracking-tight">User Reviews</h2>

      {/* Average Rating Display */}
      {reviewCount > 0 && (
        <div className="flex items-center space-x-2 mb-8 p-4 bg-secondary rounded-lg border border-border">
          <StarRating rating={Math.round(averageRating)} />
          <span className="text-xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground font-sans">({reviewCount} reviews)</span>
        </div>
      )}

      {isAuthenticated ? (
        <div className="mb-8 p-4 bg-secondary rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-3 text-foreground uppercase text-sm">
            {userReview ? (isEditing ? "Edit Your Review" : "Your Review") : "Leave a Review"}
          </h3>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-foreground uppercase text-sm font-semibold">Your Rating:</span>
            <StarRating rating={newRating} onRatingChange={setNewRating} editable={true} />
          </div>
          <Textarea
            placeholder="Share your thoughts and experience..."
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            className="w-full bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm min-h-[100px]"
            disabled={submitting || (!isEditing && !!userReview)}
          />
          <div className="flex space-x-4 mt-4">
            {(!userReview || isEditing) && (
              <Button
                onClick={handleSubmitReview}
                disabled={submitting || newRating === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20"
              >
                {submitting ? (userReview ? "Updating..." : "Posting...") : (userReview ? "Update Review" : "Submit Review")}
              </Button>
            )}
            {userReview && !isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={submitting}
                className="border-border text-foreground hover:bg-secondary text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20"
              >
                <Edit className="h-5 w-5 mr-2" /> Edit
              </Button>
            )}
            {userReview && (isEditing || !userReview) && ( // Show delete button when editing or if there's a review
              <Button
                variant="destructive"
                onClick={handleDeleteReview}
                disabled={submitting}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-destructive/20"
              >
                <Trash2 className="h-5 w-5 mr-2" /> Delete
              </Button>
            )}
            {isEditing && (
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setNewReviewText(userReview?.review_text || "");
                  setNewRating(userReview?.rating || 0);
                }}
                className="text-muted-foreground hover:text-primary text-lg px-6 py-3 rounded-lg uppercase font-semibold"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground mb-8 p-4 bg-secondary rounded-lg border border-border font-sans">
          <Link to="/login" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Log in
          </Link>{" "}
          to leave a review.
        </p>
      )}

      {loading ? (
        <p className="text-muted-foreground text-center font-sans">Loading reviews...</p>
      ) : error ? (
        <p className="text-destructive text-center font-sans">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-center font-sans">No reviews yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex space-x-4 p-4 bg-card rounded-lg border border-border">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={review.profiles?.avatar_url || undefined} alt={review.profiles?.full_name || "User"} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <UserIcon className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="text-foreground font-semibold uppercase text-sm">
                  {review.profiles?.full_name || "Anonymous User"}
                </p>
                <div className="flex items-center space-x-2 text-muted-foreground text-xs mb-2 font-sans">
                  <StarRating rating={review.rating} />
                  <span>{new Date(review.created_at).toLocaleString()}</span>
                </div>
                <p className="text-foreground font-sans">{review.review_text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;