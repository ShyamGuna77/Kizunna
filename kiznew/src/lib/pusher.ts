import PusherClient from "pusher-js";

// Check if environment variables are available
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (!pusherKey || !pusherCluster) {
  console.warn("Pusher environment variables are not properly configured");
}

export const pusherClient = new PusherClient(pusherKey || "", {
  cluster: pusherCluster || "us2",
  forceTLS: true,
});
