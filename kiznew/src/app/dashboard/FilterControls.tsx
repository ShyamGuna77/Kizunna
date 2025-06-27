"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterControlsProps {
  currentGender: string;
  currentMinAge?: number;
  currentMaxAge?: number;
}

export default function FilterControls({
  currentGender,
  currentMinAge,
  currentMaxAge,
}: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/dashboard?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/dashboard");
  };

  const hasActiveFilters =
    currentGender !== "All" || currentMinAge || currentMaxAge;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 bg-gray-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <X className="w-4 h-4" />
            <span className="font-medium">Clear All</span>
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender Filter */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                Gender
              </h3>
              <div className="flex flex-wrap gap-2">
                {["All", "Female", "Male", "Other"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() =>
                      updateFilters({
                        gender: gender === "All" ? null : gender,
                      })
                    }
                    className={`px-4 py-2 rounded-lg border-2 border-black font-medium transition-all ${
                      currentGender === gender
                        ? "bg-pink-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-gray-100 hover:bg-gray-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range Filter */}
            <div>
              <h3 className="font-bold text-lg mb-3">Age Range</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Age
                    </label>
                    <Input
                      type="number"
                      min="18"
                      max="100"
                      value={currentMinAge || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateFilters({
                          minAge: value ? value : null,
                        });
                      }}
                      className="w-full px-3 py-2 border-2 border-black rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="18"
                    />
                  </div>
                  <div className="text-gray-500 font-bold">to</div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Age
                    </label>
                    <Input
                      type="number"
                      min="18"
                      max="100"
                      value={currentMaxAge || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateFilters({
                          maxAge: value ? value : null,
                        });
                      }}
                      className="w-full px-3 py-2 border-2 border-black rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Quick Age Presets */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      updateFilters({ minAge: "18", maxAge: "25" })
                    }
                    className="px-3 py-1 text-sm bg-blue-100 rounded-lg border border-black hover:bg-blue-200 transition-colors"
                  >
                    18-25
                  </button>
                  <button
                    onClick={() =>
                      updateFilters({ minAge: "26", maxAge: "35" })
                    }
                    className="px-3 py-1 text-sm bg-blue-100 rounded-lg border border-black hover:bg-blue-200 transition-colors"
                  >
                    26-35
                  </button>
                  <button
                    onClick={() =>
                      updateFilters({ minAge: "36", maxAge: "45" })
                    }
                    className="px-3 py-1 text-sm bg-blue-100 rounded-lg border border-black hover:bg-blue-200 transition-colors"
                  >
                    36-45
                  </button>
                  <button
                    onClick={() =>
                      updateFilters({ minAge: "46", maxAge: "100" })
                    }
                    className="px-3 py-1 text-sm bg-blue-100 rounded-lg border border-black hover:bg-blue-200 transition-colors"
                  >
                    46+
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t-2 border-gray-200">
              <h4 className="font-medium text-sm text-gray-600 mb-2">
                Active Filters:
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentGender !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm border border-pink-300">
                    Gender: {currentGender}
                    <button
                      onClick={() => updateFilters({ gender: null })}
                      className="ml-1 hover:text-pink-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {currentMinAge && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm border border-blue-300">
                    Min Age: {currentMinAge}
                    <button
                      onClick={() => updateFilters({ minAge: null })}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {currentMaxAge && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm border border-blue-300">
                    Max Age: {currentMaxAge}
                    <button
                      onClick={() => updateFilters({ maxAge: null })}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
