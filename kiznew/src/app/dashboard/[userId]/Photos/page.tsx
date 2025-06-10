import React from "react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getMember(userId: string) {
  try {
    const member = await prisma.member.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        photos: true,
      },
    });
    return member;
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
}

export default async function MemberPhotos({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  const member = await getMember(userId);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-bold mb-4">Member Not Found</h1>
          <Link
            href="/dashboard"
            className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Return to Members List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href={`/dashboard/${userId}`}
          className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black mb-8 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          ← Back to Profile
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4 rounded-xl border-2 border-black overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.png"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <h1 className="text-xl font-bold">{member.name}</h1>
                <p className="text-gray-600">
                  {member.city}, {member.country}
                </p>
              </div>

              <Link
                href={`/dashboard/${userId}/chat`}
                className="w-full bg-blue-300 px-4 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Start Chat
              </Link>
            </div>
          </div>

          {/* Right Content - Photos Grid */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-bold mb-6">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {member.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-lg border-2 border-black overflow-hidden"
                  >
                    <Image
                      src={photo.url}
                      alt={`Photo of ${member.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
