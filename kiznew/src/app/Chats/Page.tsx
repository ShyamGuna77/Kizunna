import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowRight, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getConversations } from "@/app/actions/messageAction";

async function getCurrentUserMember(userId: string) {
  try {
    const member = await prisma.member.findFirst({
      where: {
        userId: userId,
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

export default async function ChatsPage() {
  // For demo purposes, we'll use a hardcoded user ID
  // In a real app, you'd get this from the session
  const demoUserId = "demo-user-id";

  const currentUserMember = await getCurrentUserMember(demoUserId);

  if (!currentUserMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-bold mb-4">User Profile Not Found</h1>
          <Link
            href="/dashboard"
            className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const conversationsResult = await getConversations(currentUserMember.id);
  const conversations = conversationsResult.success
    ? conversationsResult.conversations
    : [];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black mb-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Your Conversations</h1>
          <p className="text-gray-600 mt-2">Connect with your matches</p>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {conversations?.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-bold mb-2">No Conversations Yet</h2>
              <p className="text-gray-600 mb-4">
                Start chatting with your matches to see conversations here!
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-pink-300 px-6 py-3 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Browse Members
              </Link>
            </div>
          ) : (
            conversations?.map((conversation) => (
              <div
                key={conversation.otherUser.id}
                className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* User Avatar */}
                  <div className="relative w-16 h-16 rounded-xl border-2 border-black overflow-hidden flex-shrink-0">
                    <Image
                      src={conversation.otherUser.image || "/placeholder.jpg"}
                      alt={conversation.otherUser.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold truncate">
                        {conversation.otherUser.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 truncate mb-2">
                      {conversation.lastMessage.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          {conversation.otherUser.city},{" "}
                          {conversation.otherUser.country}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold border border-black">
                            {conversation.unreadCount} new
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/dashboard/${currentUserMember.userId}/chat`}
                        className="bg-blue-300 p-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard"
              className="bg-pink-300 p-4 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <h3 className="font-bold mb-2">Browse Members</h3>
              <p className="text-sm text-gray-600">
                Find new people to chat with
              </p>
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
