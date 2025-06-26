"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageCircle } from "lucide-react";
import Image from "next/image";
import { sendMessage, markMessagesAsRead } from "@/app/actions/messageAction";
import { pusherClient } from "@/lib/pusher";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  fromId: string;
  toId: string;
  from: {
    id: string;
    name: string;
    image?: string;
  };
  to: {
    id: string;
    name: string;
    image?: string;
  };
}

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserImage?: string;
  otherUser: {
    id: string;
    name: string;
    image?: string;
    city: string;
    country: string;
  };
  initialMessages: Message[];
  currentUserMemberId?: string;
  otherUserMemberId?: string;
}

export default function ChatInterface({
  currentUserId,
  currentUserImage,
  otherUser,
  initialMessages,
  currentUserMemberId,
  otherUserMemberId,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("initialized");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<{ name: string } | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Helper function to generate consistent channel IDs
  const getChannelId = useCallback((userId1: string, userId2: string) => {
    const sortedIds = [userId1, userId2].sort();
    return `chat-${sortedIds[0]}-${sortedIds[1]}`;
  }, []);

  // Helper function to convert message to our interface
  const convertMessage = useCallback(
    (message: {
      id: string;
      content: string;
      createdAt: Date | string;
      fromId: string;
      toId: string;
      from: {
        id: string;
        name?: string | null;
        image?: string | null;
        user?: { name?: string | null; image?: string | null };
      };
      to: {
        id: string;
        name?: string | null;
        image?: string | null;
        user?: { name?: string | null; image?: string | null };
      };
    }): Message => {
      return {
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
      };
    },
    []
  );

  // Helper function to check if message is for this conversation
  const isMessageForThisConversation = useCallback(
    (message: Message) => {
      return (
        (message.fromId === currentUserMemberId &&
          message.toId === otherUserMemberId) ||
        (message.fromId === otherUserMemberId &&
          message.toId === currentUserMemberId)
      );
    },
    [currentUserMemberId, otherUserMemberId]
  );

  // Helper function to add message without duplicates
  const addMessageIfNotExists = useCallback((newMessage: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === newMessage.id);
      if (exists) {
        console.log("Message already exists, skipping:", newMessage.id);
        return prev;
      }
      console.log("Adding new message:", newMessage.id);
      return [...prev, newMessage];
    });
  }, []);

  // Set up Pusher connection and channel subscription
  useEffect(() => {
    if (!currentUserMemberId || !otherUserMemberId) {
      console.log("Missing member IDs, skipping Pusher setup");
      return;
    }

    console.log("Setting up Pusher connection...");

    // Monitor connection state changes
    const handleStateChange = (states: {
      previous: string;
      current: string;
    }) => {
      console.log(
        `Pusher state changed: ${states.previous} -> ${states.current}`
      );
      setConnectionStatus(states.current);
    };

    const handleConnected = () => {
      console.log("Pusher connected successfully");
      setConnectionStatus("connected");
    };

    const handleDisconnected = () => {
      console.log("Pusher disconnected");
      setConnectionStatus("disconnected");
    };

    const handleError = (error: { error: { data: { code: number } } }) => {
      console.error("Pusher connection error:", error);
      setConnectionStatus("failed");
    };

    // Bind to connection events
    pusherClient.connection.bind("state_change", handleStateChange);
    pusherClient.connection.bind("connected", handleConnected);
    pusherClient.connection.bind("disconnected", handleDisconnected);
    pusherClient.connection.bind("error", handleError);

    // Wait for connection to be established before subscribing
    const setupChannel = () => {
      if (pusherClient.connection.state !== "connected") {
        console.log("Waiting for connection...");
        setTimeout(setupChannel, 100);
        return;
      }

      console.log("Connection established, setting up channel...");

      // Create channel ID for this conversation
      const channelId = getChannelId(currentUserMemberId, otherUserMemberId);
      console.log(`Subscribing to channel: ${channelId}`);

      // Subscribe to the public channel
      const channel = pusherClient.subscribe(channelId);
      channelRef.current = channel;

      // Handle subscription success
      channel.bind("pusher:subscription_succeeded", () => {
        console.log(`Successfully subscribed to ${channelId}`);
        setConnectionStatus("connected");

        // Mark messages as read when chat is opened
        markMessagesAsRead(otherUser.id, currentUserId);
      });

      // Handle subscription errors
      channel.bind(
        "pusher:subscription_error",
        (error: { message: string }) => {
          console.error(`Failed to subscribe to ${channelId}:`, error);
          setConnectionStatus("failed");
        }
      );

      // Bind to new message events
      channel.bind(
        "new-message",
        (data: {
          message: {
            id: string;
            content: string;
            createdAt: Date | string;
            fromId: string;
            toId: string;
            from: {
              id: string;
              name?: string | null;
              image?: string | null;
              user?: { name?: string | null; image?: string | null };
            };
            to: {
              id: string;
              name?: string | null;
              image?: string | null;
              user?: { name?: string | null; image?: string | null };
            };
          };
        }) => {
          console.log("Received Pusher message:", data);

          const convertedMessage = convertMessage(data.message);

          if (isMessageForThisConversation(convertedMessage)) {
            addMessageIfNotExists(convertedMessage);

            // Mark as read if we're the recipient
            if (convertedMessage.toId === currentUserMemberId) {
              markMessagesAsRead(otherUser.id, currentUserId);
            }
          } else {
            console.log("Message not for this conversation, ignoring");
          }
        }
      );
    };

    // Start the setup process
    setupChannel();

    // Cleanup function
    return () => {
      console.log("Cleaning up Pusher connection...");

      // Unbind connection events
      pusherClient.connection.unbind("state_change", handleStateChange);
      pusherClient.connection.unbind("connected", handleConnected);
      pusherClient.connection.unbind("disconnected", handleDisconnected);
      pusherClient.connection.unbind("error", handleError);

      // Unsubscribe from channel
      if (channelRef.current) {
        console.log("Unsubscribing from channel:", channelRef.current.name);
        pusherClient.unsubscribe(channelRef.current.name);
        channelRef.current = null;
      }
    };
  }, [
    currentUserId,
    otherUser.id,
    currentUserMemberId,
    otherUserMemberId,
    getChannelId,
    convertMessage,
    isMessageForThisConversation,
    addMessageIfNotExists,
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX

    try {
      console.log("Sending message:", messageContent);
      const result = await sendMessage(
        currentUserId,
        otherUser.id,
        messageContent
      );

      if (result.success) {
        console.log("Message sent successfully:", result.message);

        // Add the message to local state immediately for better UX
        if (result.message) {
          const convertedMessage = convertMessage(result.message);
          addMessageIfNotExists(convertedMessage);
        }
      } else {
        console.error("Failed to send message:", result.error);
        // Restore the message if sending failed
        setNewMessage(messageContent);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore the message if sending failed
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "initialized":
        return "Initializing...";
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Online";
      case "unavailable":
        return "Unavailable";
      case "failed":
        return "Connection Failed";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "initialized":
        return "bg-blue-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-[500px] md:h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-3 md:p-4 border-b-2 border-black flex items-center gap-3 md:gap-4 bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-black overflow-hidden">
          <Image
            src={otherUser.image || "/images/placeholder.jpg"}
            alt={otherUser.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base md:text-lg truncate">
            {otherUser.name}
          </h2>
          <p className="text-xs md:text-sm text-gray-600 truncate">
            {otherUser.city}, {otherUser.country}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-black ${getConnectionStatusColor()}`}
          ></div>
          <span className="text-xs text-gray-600 hidden sm:inline">
            {getConnectionStatusText()}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-pink-50 to-purple-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-6 md:mt-8">
            <div className="mb-3 md:mb-4">
              <MessageCircle className="w-8 h-8 md:w-12 md:h-12 mx-auto text-gray-300" />
            </div>
            <p className="text-base md:text-lg font-medium mb-1 md:mb-2">
              No messages yet
            </p>
            <p className="text-xs md:text-sm">
              Start the conversation with {otherUser.name}!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isFromCurrentUser = message.fromId === currentUserMemberId;
            return (
              <div
                key={message.id}
                className={`flex ${
                  isFromCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] lg:max-w-[60%] p-3 rounded-2xl border-2 border-black ${
                    isFromCurrentUser
                      ? "bg-blue-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-pink-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="relative w-5 h-5 rounded-full border border-black overflow-hidden">
                      <Image
                        src={
                          isFromCurrentUser
                            ? currentUserImage || "/images/placeholder.jpg"
                            : otherUser.image || "/images/placeholder.jpg"
                        }
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs font-bold">
                      {isFromCurrentUser ? "You" : otherUser.name}
                    </p>
                  </div>
                  <p className="text-gray-800 mb-1 leading-relaxed text-sm">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-600 text-right">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 md:p-4 border-t-2 border-black bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${otherUser.name}...`}
            className="flex-1 px-3 py-2 md:px-4 md:py-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white placeholder-gray-500 text-sm"
            disabled={isSending || connectionStatus !== "connected"}
          />
          <button
            type="submit"
            disabled={
              !newMessage.trim() ||
              isSending ||
              connectionStatus !== "connected"
            }
            className="bg-pink-300 px-4 py-2 md:px-6 md:py-3 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-1 md:gap-2"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline text-sm">Send</span>
          </button>
        </form>
        {connectionStatus !== "connected" && (
          <p className="text-xs text-red-500 mt-2 text-center">
            {getConnectionStatusText()}
          </p>
        )}
      </div>
    </div>
  );
}
