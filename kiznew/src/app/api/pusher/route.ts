import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    if (!pusher) {
      return NextResponse.json(
        { error: "Pusher not configured" },
        { status: 500 }
      );
    }

    const { socket_id, channel_name } = await request.json();

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: "Missing socket_id or channel_name" },
        { status: 400 }
      );
    }

    const authResponse = pusher.authorizeChannel(socket_id, channel_name);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 403 }
    );
  }
}
