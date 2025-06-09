"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function AddMembersButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/members", { method: "POST" });
      const data = await response.json();

      if (response.ok) {
        toast.success("Members added successfully!");
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to add members");
      }
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("An error occurred while adding members");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddMembers}
      disabled={isLoading}
      className="px-6 py-3 bg-[#FF6B6B] text-white font-bold text-lg rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Adding Members..." : "Add Sample Members"}
    </button>
  );
}
