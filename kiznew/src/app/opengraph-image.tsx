import { ImageResponse } from "next/og";

export const alt = "Kizuna - Find Your Soulmate Today";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div tw="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-pink-50 to-purple-50 relative">
        {/* Background Pattern */}
        <div tw="absolute inset-0 opacity-10">
          <div tw="absolute top-20 left-20 w-32 h-32 bg-pink-300 rounded-full"></div>
          <div tw="absolute top-40 right-32 w-24 h-24 bg-purple-300 rounded-full"></div>
          <div tw="absolute bottom-32 left-40 w-20 h-20 bg-pink-200 rounded-full"></div>
          <div tw="absolute bottom-20 right-20 w-28 h-28 bg-purple-200 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div tw="flex flex-col items-center justify-center relative z-10">
          {/* Logo and Brand */}
          <div tw="flex items-center mb-8">
            <div tw="bg-pink-400 p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mr-4">
              <div tw="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <div tw="w-8 h-8 bg-pink-500 rounded-full"></div>
              </div>
            </div>
            <h1 tw="text-6xl font-bold text-gray-900">KIZUNA</h1>
          </div>

          {/* Tagline */}
          <div tw="bg-pink-300 px-6 py-2 rounded-full border-2 border-black mb-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <span tw="text-lg font-semibold text-gray-900">
              #1 Dating App of 2025
            </span>
          </div>

          {/* Main Headline */}
          <h2 tw="text-5xl font-bold text-center mb-4">
            Find Your{" "}
            <span tw="bg-pink-500 text-white px-4 py-2 -rotate-2 inline-block border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              Soulmate
            </span>{" "}
            Today!
          </h2>

          {/* Description */}
          <p tw="text-xl text-gray-700 text-center max-w-2xl mb-8">
            Join thousands of singles looking for true love and meaningful
            connections. Our unique matching algorithm helps you find people who
            share your heart&apos;s desires.
          </p>

          {/* Features */}
          <div tw="flex gap-6">
            <div tw="flex items-center bg-white px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div tw="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span tw="text-sm font-medium">Verified Profiles</span>
            </div>
            <div tw="flex items-center bg-white px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div tw="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span tw="text-sm font-medium">Smart Matching</span>
            </div>
            <div tw="flex items-center bg-white px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div tw="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
              <span tw="text-sm font-medium">Real Connections</span>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div tw="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400"></div>
      </div>
    ),
    {
      ...size,
    }
  );
}
