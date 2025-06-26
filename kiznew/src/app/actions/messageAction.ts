"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Pusher from "pusher";

// Check if environment variables are available
const pusherAppId = process.env.PUSHER_APP_ID;
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherSecret = process.env.PUSHER_SECRET;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

// Initialize Pusher only if all required environment variables are available
const pusher =
  pusherAppId && pusherKey && pusherSecret && pusherCluster
    ? new Pusher({
        appId: pusherAppId,
        key: pusherKey,
        secret: pusherSecret,
        cluster: pusherCluster,
        useTLS: true,
      })
    : null;

export async function sendMessage(
  fromUserId: string,
  toUserId: string,
  content: string
) {
  try {
    // Get the member IDs for the user IDs
    const fromMember = await prisma.member.findUnique({
      where: { userId: fromUserId },
    });

    const toMember = await prisma.member.findUnique({
      where: { userId: toUserId },
    });

    if (!fromMember || !toMember) {
      return { success: false, error: "User not found" };
    }

    const message = await prisma.message.create({
      data: {
        fromId: fromMember.id,
        toId: toMember.id,
        content,
      },
      include: {
        from: {
          include: {
            user: true,
          },
        },
        to: {
          include: {
            user: true,
          },
        },
      },
    });

    // Trigger Pusher event for real-time updates only if Pusher is configured
    if (pusher) {
      try {
        const channelId = getChannelId(fromMember.id, toMember.id);
        const publicChannelName = `chat-${channelId}`;
        console.log(`Triggering Pusher event on channel: ${publicChannelName}`);

        await pusher.trigger(publicChannelName, "new-message", {
          message: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            fromId: message.fromId,
            toId: message.toId,
            from: message.from,
            to: message.to,
          },
        });

        console.log("Pusher event triggered successfully");
      } catch (pusherError) {
        console.error("Pusher trigger error:", pusherError);
        // Continue execution even if Pusher fails
      }
    } else {
      console.warn("Pusher not configured, skipping real-time update");
    }

    revalidatePath("/chats");
    revalidatePath(`/dashboard/${fromUserId}/chat`);
    revalidatePath(`/dashboard/${toUserId}/chat`);

    return { success: true, message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function getMessages(userId1: string, userId2: string) {
  try {
    // Get the member IDs for the user IDs
    const member1 = await prisma.member.findUnique({
      where: { userId: userId1 },
    });

    const member2 = await prisma.member.findUnique({
      where: { userId: userId2 },
    });

    if (!member1 || !member2) {
      return { success: false, error: "User not found" };
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromId: member1.id, toId: member2.id },
          { fromId: member2.id, toId: member1.id },
        ],
      },
      include: {
        from: {
          include: {
            user: true,
          },
        },
        to: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function markMessagesAsRead(fromUserId: string, toUserId: string) {
  try {
    // Get the member IDs for the user IDs
    const fromMember = await prisma.member.findUnique({
      where: { userId: fromUserId },
    });

    const toMember = await prisma.member.findUnique({
      where: { userId: toUserId },
    });

    if (!fromMember || !toMember) {
      return { success: false, error: "User not found" };
    }

    await prisma.message.updateMany({
      where: {
        fromId: fromMember.id,
        toId: toMember.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath("/chats");
    revalidatePath(`/dashboard/${toUserId}/chat`);

    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false, error: "Failed to mark messages as read" };
  }
}

export async function getConversations(memberId: string) {
  try {
    // Get all conversations for a member
    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ fromId: memberId }, { toId: memberId }],
      },
      include: {
        from: {
          include: {
            user: true,
          },
        },
        to: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group conversations by the other user
    const conversationMap = new Map();

    conversations.forEach((message) => {
      const otherMemberId =
        message.fromId === memberId ? message.toId : message.fromId;
      const otherMember =
        message.fromId === memberId ? message.to : message.from;

      if (!conversationMap.has(otherMemberId)) {
        conversationMap.set(otherMemberId, {
          otherUser: otherMember,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (message.toId === memberId && !message.isRead) {
        conversationMap.get(otherMemberId).unreadCount++;
      }
    });

    return {
      success: true,
      conversations: Array.from(conversationMap.values()),
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { success: false, error: "Failed to fetch conversations" };
  }
}

// Helper function to generate consistent channel IDs
function getChannelId(userId1: string, userId2: string) {
  const sortedIds = [userId1, userId2].sort();
  return `chat-${sortedIds[0]}-${sortedIds[1]}`;
}
