


import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getMember(userId: string) {
  try {
    const member = await prisma.member.findFirst({
      where: {
        user: {
          email: userId,
        },
      },
      include: {
        user: true,
      },
    });
    return member;
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
}

export default async function MemberChat({
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
                href={`/dashboard/${userId}/photos`}
                className="w-full bg-purple-300 px-4 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                View Photos
              </Link>
            </div>
          </div>

          {/* Right Content - Chat Interface */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b-2 border-black flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-lg border-2 border-black overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.png"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-bold">{member.name}</h2>
                  <p className="text-sm text-gray-600">Online</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {/* Demo Messages */}
                <div className="flex justify-end">
                  <div className="bg-blue-300 p-3 rounded-lg border-2 border-black max-w-[70%]">
                    <p>Hey there! How are you doing?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-pink-300 p-3 rounded-lg border-2 border-black max-w-[70%]">
                    <p>
                      Hi! I'm doing great, thanks for asking! How about you?
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-300 p-3 rounded-lg border-2 border-black max-w-[70%]">
                    <p>
                      I&apos;m good too! Would you like to grab coffee sometime?
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t-2 border-black">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <button className="bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
