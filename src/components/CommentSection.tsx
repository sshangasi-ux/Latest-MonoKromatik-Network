"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchComments, addComment, Comment } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface CommentSectionProps {
  contentId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ contentId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedComments = await fetchComments(contentId);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contentId) {
      loadComments();
    }
  }, [contentId]);

  const handleSubmitComment = async () => {
    if (!isAuthenticated || !user || !newCommentText.trim()) {
      toast.error("Please log in and enter a comment.");
      return;
    }

    setSubmitting(true);
    try {
      await addComment(user.id, contentId, newCommentText.trim());
      setNewCommentText("");
      toast.success("Comment posted successfully!");
      loadComments(); // Reload comments to show the new one
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-heading font-bold mb-6 uppercase tracking-tight">Comments</h2>

      {isAuthenticated ? (
        <div className="mb-8 p-4 bg-secondary rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-3 text-foreground uppercase text-sm">Leave a Comment</h3>
          <Textarea
            placeholder="Share your thoughts..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full bg-input border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground uppercase text-sm min-h-[80px]"
            disabled={submitting}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={submitting || !newCommentText.trim()}
            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 rounded-lg uppercase font-semibold transition-all hover:scale-[1.02] hover:shadow-primary/20"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground mb-8 p-4 bg-secondary rounded-lg border border-border font-sans">
          <Link to="/login" className="text-primary hover:text-primary/90 underline uppercase font-semibold text-sm">
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}

      {loading ? (
        <p className="text-muted-foreground text-center font-sans">Loading comments...</p>
      ) : error ? (
        <p className="text-destructive text-center font-sans">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-center font-sans">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4 p-4 bg-card rounded-lg border border-border">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={comment.profiles?.avatar_url || undefined} alt={comment.profiles?.full_name || "User"} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <UserIcon className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="text-foreground font-semibold uppercase text-sm">
                  {comment.profiles?.full_name || "Anonymous User"}
                </p>
                <p className="text-muted-foreground text-xs mb-2 font-sans">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
                <p className="text-foreground font-sans">{comment.comment_text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;