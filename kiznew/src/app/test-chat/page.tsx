import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getAllMembers() {
  try {
    const members = await prisma.member.findMany({
      include: {
        user: true,
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

export default async function TestChatPage() {
  const members = await getAllMembers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black mb-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Test Chat System</h1>
          <p className="text-gray-600 mt-2">
            Select a user to act as &quot;you&quot; and then choose who to chat
            with
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-16 h-16 rounded-xl border-2 border-black overflow-hidden">
                  <Image
                    src={member.image || "/images/placeholder.jpg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-gray-600">
                    {member.city}, {member.country}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
                <strong>User ID:</strong> {member.userId}
              </p>

              <div className="space-y-2">
                <Link
                  href={`/dashboard/${member.userId}`}
                  className="w-full bg-purple-300 px-3 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm font-medium block text-center"
                >
                  View Profile
                </Link>

                <div className="text-xs text-gray-600 mb-2">Chat with:</div>
                {members
                  .filter((m) => m.userId !== member.userId)
                  .slice(0, 3)
                  .map((otherMember) => (
                    <Link
                      key={otherMember.id}
                      href={`/chats?target=${otherMember.userId}`}
                      className="w-full bg-blue-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm font-medium"
                    >
                      Chat
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4">How to Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold mb-2 text-blue-800">
                1. Choose Your Identity
              </h3>
              <p className="text-sm text-blue-700">
                Click on a user card above to act as that person
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold mb-2 text-green-800">
                2. Start Chatting
              </h3>
              <p className="text-sm text-green-700">
                Click &quot;Chat with [Name]&quot; to start a conversation
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-bold mb-2 text-purple-800">
                3. View History
              </h3>
              <p className="text-sm text-purple-700">
                Check /chats to see inbox and outbox messages
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4">Quick Test Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/chats"
              className="bg-green-300 p-4 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <h3 className="font-bold mb-2">View All Chats</h3>
              <p className="text-sm text-gray-600">See conversation history</p>
            </Link>
            <Link
              href="/dashboard"
              className="bg-orange-300 p-4 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <h3 className="font-bold mb-2">Browse Members</h3>
              <p className="text-sm text-gray-600">Find people to chat with</p>
            </Link>
            <Link
              href="/matches"
              className="bg-purple-300 p-4 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <h3 className="font-bold mb-2">View Matches</h3>
              <p className="text-sm text-gray-600">
                See who liked your profile
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
