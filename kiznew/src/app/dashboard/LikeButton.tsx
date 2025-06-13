"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleLike } from "../actions/likeActions";
import { toast } from "sonner";

interface LikeButtonProps {
  memberId: string;
  initialLiked: boolean;
}

export default function LikeButton({
  memberId,
  initialLiked,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    try {
      setIsLoading(true);
      const result = await toggleLike(memberId);
      setIsLiked(result.liked);
      toast.success(result.liked ? "Profile liked!" : "Profile unliked!");
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLike();
      }}
      disabled={isLoading}
      className="bg-white p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
    >
      <Heart
        className={`h-5 w-5 ${isLiked ? "text-pink-500" : "text-gray-400"}`}
        fill={isLiked ? "#ec4899" : "none"}
      />
    </button>
  );
}
