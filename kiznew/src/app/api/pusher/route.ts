import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";
import { getSession } from "@/lib/session";

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

export async function POST(request: NextRequest) {
  try {
    console.log("Pusher auth request received");

    // Check environment variables
    console.log("Environment variables check:", {
      hasAppId: !!process.env.PUSHER_APP_ID,
      hasKey: !!process.env.NEXT_PUBLIC_PUSHER_KEY,
      hasSecret: !!process.env.PUSHER_SECRET,
      hasCluster: !!process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    if (!pusher) {
      console.error("Pusher not configured - missing environment variables");
      return NextResponse.json(
        { error: "Pusher not configured" },
        { status: 500 }
      );
    }

    // Try to get session, but don't fail if it's not available
    let userId = "anonymous";
    try {
      console.log("Getting session...");
      const session = await getSession();
      console.log("Session result:", {
        hasSession: !!session,
        userId: session?.user?.id,
      });

      if (session?.user?.id) {
        userId = session.user.id;
      } else {
        console.warn("No session found, using anonymous user");
      }
    } catch (sessionError) {
      console.warn(
        "Session error, continuing with anonymous user:",
        sessionError
      );
    }

    console.log("Parsing request body...");
    const body = await request.json();
    console.log("Request body:", body);

    const { socket_id, channel_name } = body;

    if (!socket_id || !channel_name) {
      console.error("Missing socket_id or channel_name", {
        socket_id,
        channel_name,
      });
      return NextResponse.json(
        { error: "Missing socket_id or channel_name" },
        { status: 400 }
      );
    }

    console.log(`Authorizing channel: ${channel_name} for user: ${userId}`);

    // Authorize the channel
    const authResponse = pusher.authorizeChannel(socket_id, channel_name);
    console.log("Channel authorization successful", { authResponse });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);

    // Return more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Authentication failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
