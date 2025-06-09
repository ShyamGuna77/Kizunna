"use client";

import { useState } from "react";

export default function AddMembersButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/members", { method: "POST" });
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to add members");
      }
    } catch (error) {
      console.error("Error adding members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddMembers}
      disabled={isLoading}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {isLoading ? "Adding Members..." : "Add Sample Members"}
    </button>
  );
}
