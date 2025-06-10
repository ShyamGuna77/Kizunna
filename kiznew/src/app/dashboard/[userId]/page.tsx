import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Image as ImageIcon } from "lucide-react";
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

export default async function MemberDetails({
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
          href="/dashboard"
          className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black mb-8 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          ← Back to Members
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile & Navigation */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-48 h-48 mb-4 rounded-xl border-2 border-black overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.png"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <h1 className="text-2xl font-bold">{member.name}</h1>
                <p className="text-gray-600">
                  {member.city}, {member.country}
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-pink-300 px-4 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Heart className="w-5 h-5" />
                  <span>Like Profile</span>
                </button>
                <Link
                  href={`/dashboard/${userId}/Chat`}
                  className="w-full bg-blue-300 px-4 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Chat</span>
                </Link>
                <Link
                  href={`/dashboard/${userId}/Photos`}
                  className="w-full bg-purple-300 px-4 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>View Photos</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">
                    {new Date(member.created).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Active</span>
                  <span className="font-semibold">
                    {new Date(member.updated).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Photos</span>
                  <span className="font-semibold">{member.photos.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">About</h2>
                  <p className="text-gray-700">{member.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-pink-100 p-4 rounded-lg border-2 border-black">
                    <h3 className="text-sm font-medium text-gray-500">
                      Gender
                    </h3>
                    <p className="mt-1 font-semibold">{member.gender}</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg border-2 border-black">
                    <h3 className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </h3>
                    <p className="mt-1 font-semibold">
                      {new Date(member.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg border-2 border-black">
                    <h3 className="text-sm font-medium text-gray-500">
                      Location
                    </h3>
                    <p className="mt-1 font-semibold">
                      {member.city}, {member.country}
                    </p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg border-2 border-black">
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 font-semibold">{member.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
