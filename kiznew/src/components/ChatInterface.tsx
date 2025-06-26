"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when chat is opened
    markMessagesAsRead(otherUser.id, currentUserId);

    // Subscribe to Pusher channel with error handling
    try {
      const channel = pusherClient.subscribe("chat-channel");

      // Set up connection status monitoring
      pusherClient.connection.bind("connected", () => {
        setConnectionStatus("connected");
        console.log("Connected to Pusher");
      });

      pusherClient.connection.bind("disconnected", () => {
        setConnectionStatus("disconnected");
        console.log("Disconnected from Pusher");
      });

      pusherClient.connection.bind("error", (err: Error) => {
        setConnectionStatus("error");
        console.error("Pusher connection error:", err);
      });

      channel.bind("new-message", (data: { message: Message }) => {
        const { message } = data;

        // Only add message if it's part of this conversation
        if (
          (message.fromId === currentUserMemberId &&
            message.toId === otherUserMemberId) ||
          (message.fromId === otherUserMemberId &&
            message.toId === currentUserMemberId)
        ) {
          setMessages((prev) => [...prev, message]);

          // Mark as read if we're the recipient
          if (message.toId === currentUserMemberId) {
            markMessagesAsRead(otherUser.id, currentUserId);
          }
        }
      });

      return () => {
        pusherClient.unsubscribe("chat-channel");
      };
    } catch (error) {
      console.error("Error setting up Pusher subscription:", error);
      setConnectionStatus("error");
    }
  }, [currentUserId, otherUser.id, currentUserMemberId, otherUserMemberId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      const result = await sendMessage(currentUserId, otherUser.id, newMessage);

      if (result.success) {
        setNewMessage("");
        // Add the message to the local state immediately for better UX
        if (result.message) {
          // Convert the message to match our interface
          const convertedMessage: Message = {
            ...result.message,
            createdAt:
              result.message.createdAt instanceof Date
                ? result.message.createdAt.toISOString()
                : result.message.createdAt,
            from: {
              id: result.message.from.id,
              name:
                result.message.from.name ||
                result.message.from.user?.name ||
                "Unknown",
              image:
                result.message.from.image ||
                result.message.from.user?.image ||
                undefined,
            },
            to: {
              id: result.message.to.id,
              name:
                result.message.to.name ||
                result.message.to.user?.name ||
                "Unknown",
              image:
                result.message.to.image ||
                result.message.to.user?.image ||
                undefined,
            },
          };
          setMessages((prev) => [...prev, convertedMessage]);
        }
      } else {
        console.error("Failed to send message:", result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-black ${
              connectionStatus === "connected"
                ? "bg-green-500"
                : connectionStatus === "connecting"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          ></div>
          <span className="text-xs text-gray-600 hidden sm:inline">
            {connectionStatus === "connected"
              ? "Online"
              : connectionStatus === "connecting"
              ? "Connecting..."
              : "Offline"}
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
            {connectionStatus === "connecting"
              ? "Connecting to chat..."
              : "Connection lost. Trying to reconnect..."}
          </p>
        )}
      </div>
    </div>
  );
}
