import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowRight, Inbox, Send } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getConversations, getMessages } from "@/app/actions/messageAction";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";

async function getCurrentUserMember() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return null;
    }

    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    });
    return member;
  } catch (error) {
    console.error("Error fetching current member:", error);
    return null;
  }
}

async function getAllOtherMembers(currentUserId: string) {
  try {
    const members = await prisma.member.findMany({
      where: {
        userId: {
          not: currentUserId,
        },
      },
      include: { user: true },
    });
    return members;
  } catch (error) {
    console.error("Error fetching other members:", error);
    return [];
  }
}

async function ChatPage({ target }: { target: string }) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      redirect("/Sign-in");
    }

    // Get the current user and target user details
    const currentUser = await prisma.member.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    });

    const targetUser = await prisma.member.findUnique({
      where: { userId: target },
      include: { user: true },
    });

    if (!currentUser || !targetUser) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
              <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
              <p className="text-gray-600 mb-6">
                The user you're trying to chat with doesn't exist.
              </p>
              <Link
                href="/chats"
                className="bg-blue-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Back to Chats
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Get messages between these users
    const messagesResult = await getMessages(session.user.id, target);
    const messages = messagesResult.success ? messagesResult.messages : [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/chats"
              className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              ← Back to Chats
            </Link>
          </div>

          <ChatInterface
            currentUserId={session.user.id}
            otherUser={{
              id: target,
              name: targetUser.name,
              image: targetUser.image,
              city: targetUser.city,
              country: targetUser.country,
            }}
            initialMessages={messages}
            currentUserMemberId={currentUser.id}
            otherUserMemberId={targetUser.id}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ChatPage:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-600 mb-6">
              Something went wrong while loading the chat.
            </p>
            <Link
              href="/chats"
              className="bg-blue-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Back to Chats
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ target?: string }>;
}) {
  const params = await searchParams;
  const { target } = params;

  // If target is provided, show the chat interface
  if (target) {
    return <ChatPage target={target} />;
  }

  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/Sign-in");
  }

  const currentUserMember = await getCurrentUserMember();
  if (!currentUserMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="mb-4">Please create your profile first!</p>
          <Link
            href="/dashboard"
            className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const otherMembers = await getAllOtherMembers(session.user.id);

  if (otherMembers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-bold mb-4">No Other Members</h1>
          <p className="mb-4">There are no other members to chat with yet.</p>
          <Link
            href="/dashboard"
            className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Browse Members
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

  // Separate inbox and outbox
  const inboxMessages = conversations.filter(
    (conv) => conv.lastMessage.fromId !== currentUserMember.id
  );
  const outboxMessages = conversations.filter(
    (conv) => conv.lastMessage.fromId === currentUserMember.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg border-2 border-black overflow-hidden">
                <Image
                  src={currentUserMember.image || "/images/placeholder.jpg"}
                  alt={currentUserMember.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Logged in as:</p>
                <p className="font-semibold">{currentUserMember.name}</p>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Your Conversations</h1>
          <p className="text-gray-600 mt-2">Chat with other members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inbox Messages */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Inbox className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">
                Inbox ({inboxMessages.length})
              </h2>
            </div>

            {inboxMessages.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-bold mb-2">No Incoming Messages</h3>
                <p className="text-gray-600">
                  Messages from others will appear here
                </p>
              </div>
            ) : (
              inboxMessages.map((conversation) => (
                <div
                  key={conversation.otherUser.id}
                  className="bg-white rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg border-2 border-black overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          conversation.otherUser.image ||
                          "/images/placeholder.jpg"
                        }
                        alt={conversation.otherUser.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold truncate">
                          {conversation.otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {conversation.otherUser.city},{" "}
                          {conversation.otherUser.country}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold border border-black">
                            {conversation.unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/chats?target=${conversation.otherUser.userId}`}
                      className="bg-blue-300 p-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Outbox Messages */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold">
                Outbox ({outboxMessages.length})
              </h2>
            </div>

            {outboxMessages.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-bold mb-2">No Sent Messages</h3>
                <p className="text-gray-600">
                  Messages you&apos;ve sent will appear here
                </p>
              </div>
            ) : (
              outboxMessages.map((conversation) => (
                <div
                  key={conversation.otherUser.id}
                  className="bg-white rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg border-2 border-black overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          conversation.otherUser.image ||
                          "/images/placeholder.jpg"
                        }
                        alt={conversation.otherUser.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold truncate">
                          {conversation.otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {conversation.otherUser.city},{" "}
                          {conversation.otherUser.country}
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                          Sent
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/chats?target=${conversation.otherUser.userId}`}
                      className="bg-blue-300 p-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              className="bg-orange-300 p-4 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <h3 className="font-bold mb-2">View Matches</h3>
              <p className="text-sm text-gray-600">
                See who liked your profile
              </p>
            </Link>
            <Link
              href="/test-chat"
              className="bg-blue-300 p-4 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <h3 className="font-bold mb-2">Test Chat</h3>
              <p className="text-sm text-gray-600">Test chat functionality</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
