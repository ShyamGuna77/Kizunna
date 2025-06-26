import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { getMessages } from "@/app/actions/messageAction";

async function getMember(userId: string) {
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

async function getOtherMembers(userId: string) {
  try {
    const members = await prisma.member.findMany({
      where: {
        userId: {
          not: userId,
        },
      },
      include: {
        user: true,
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching other members:", error);
    return [];
  }
}

export default async function MemberChat({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ target?: string }>;
}) {
  const { userId } = await params;
  const { target } = await searchParams;
  const session = await getSession();

  if (!session) {
    redirect("/Sign-in");
  }

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

  // If target is provided, show chat with that specific user
  if (target) {
    const targetUser = await getMember(target);
    if (!targetUser) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-2xl font-bold mb-4">Target User Not Found</h1>
            <Link
              href={`/dashboard/${userId}/chat`}
              className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Back to Chat
            </Link>
          </div>
        </div>
      );
    }

    // Get messages between current user and target user
    const messagesResult = await getMessages(session.user.id, target);
    const messages = messagesResult.success ? messagesResult.messages : [];

    // Convert messages to match the Message interface
    const convertedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt:
        message.createdAt instanceof Date
          ? message.createdAt.toISOString()
          : message.createdAt,
      fromId: message.fromId,
      toId: message.toId,
      from: {
        id: message.from.id,
        name: message.from.name || message.from.user?.name || "Unknown",
        image: message.from.image || message.from.user?.image || undefined,
      },
      to: {
        id: message.to.id,
        name: message.to.name || message.to.user?.name || "Unknown",
        image: message.to.image || message.to.user?.image || undefined,
      },
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/dashboard/${userId}/chat`}
            className="inline-block bg-pink-300 px-4 py-2 rounded-lg border-2 border-black mb-8 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            ← Back to Chat
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 mb-4 rounded-xl border-2 border-black overflow-hidden">
                    <Image
                      src={member.image || "/images/placeholder.jpg"}
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
                  href={`/dashboard/${userId}/Photos`}
                  className="w-full bg-purple-300 px-4 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  View Photos
                </Link>
              </div>
            </div>

            {/* Right Content - Real Chat Interface */}
            <div className="md:col-span-2">
              <ChatInterface
                currentUserId={session.user.id}
                currentUserImage={member.image || undefined}
                otherUser={{
                  id: target,
                  name: targetUser.name,
                  image: targetUser.image || undefined,
                  city: targetUser.city,
                  country: targetUser.country,
                }}
                initialMessages={convertedMessages}
                currentUserMemberId={member.id}
                otherUserMemberId={targetUser.id}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no target, show list of users to chat with
  const otherMembers = await getOtherMembers(userId);

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
                    src={member.image || "/images/placeholder.jpg"}
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
                href={`/dashboard/${userId}/Photos`}
                className="w-full bg-purple-300 px-4 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                View Photos
              </Link>
            </div>
          </div>

          {/* Right Content - Chat Selection */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-bold mb-6">Chat with Others</h2>

              {otherMembers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    No other members to chat with yet.
                  </p>
                  <Link
                    href="/dashboard"
                    className="bg-blue-300 px-4 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Browse Members
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherMembers.map((otherMember) => (
                    <Link
                      key={otherMember.id}
                      href={`/dashboard/${userId}/chat?target=${otherMember.userId}`}
                      className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg border-2 border-black overflow-hidden">
                          <Image
                            src={otherMember.image || "/images/placeholder.jpg"}
                            alt={otherMember.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{otherMember.name}</h3>
                          <p className="text-sm text-gray-600">
                            {otherMember.city}, {otherMember.country}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
