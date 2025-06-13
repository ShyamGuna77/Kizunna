"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function toggleLike(toId: string) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    // Get or create the current user's member profile
    let currentMember = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!currentMember) {
      // Create a new member profile if it doesn't exist
      currentMember = await prisma.member.create({
        data: {
          userId: session.user.id,
          name: session.user.name || "New Member",
          gender: "Other",
          dateOfBirth: new Date(),
          description: "No description yet",
          city: "Unknown",
          country: "Unknown",
        },
      });
    }

    // Verify the target member exists
    const targetMember = await prisma.member.findUnique({
      where: { id: toId },
    });

    if (!targetMember) {
      throw new Error("Target member not found");
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        fromId_toId: {
          fromId: currentMember.id,
          toId: toId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          fromId_toId: {
            fromId: currentMember.id,
            toId: toId,
          },
        },
      });
      return { liked: false };
    } else {
      await prisma.like.create({
        data: {
          fromId: currentMember.id,
          toId: toId,
        },
      });
      return { liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
}

export async function getLikes() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    // Get or create the current user's member profile
    let currentMember = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!currentMember) {
      // Create a new member profile if it doesn't exist
      currentMember = await prisma.member.create({
        data: {
          userId: session.user.id,
          name: session.user.name || "New Member",
          gender: "Other",
          dateOfBirth: new Date(),
          description: "No description yet",
          city: "Unknown",
          country: "Unknown",
        },
      });
    }

    // Get all likes with proper member data and handle missing relations
    const [likedByRaw, likedRaw] = await Promise.all([
      // Who liked you
      prisma.like.findMany({
        where: {
          toId: currentMember.id,
        },
        include: {
          from: {
            select: {
              id: true,
              userId: true,
              name: true,
              image: true,
              city: true,
              country: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      }),
      // Who you liked
      prisma.like.findMany({
        where: {
          fromId: currentMember.id,
        },
        include: {
          to: {
            select: {
              id: true,
              userId: true,
              name: true,
              image: true,
              city: true,
              country: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Filter out any likes where the related member doesn't exist and clean up orphaned records
    const likedBy = likedByRaw.filter((like) => like.from !== null);
    const liked = likedRaw.filter((like) => like.to !== null);

    // For mutual likes, we need to check if the target member also liked back
    const mutualLikes = [];
    for (const like of likedRaw) {
      if (like.to !== null) {
        // Check if this member also liked the current user back
        const reciprocalLike = await prisma.like.findFirst({
          where: {
            fromId: like.toId,
            toId: currentMember.id,
          },
          include: {
            from: {
              select: {
                id: true,
                userId: true,
                name: true,
                image: true,
                city: true,
                country: true,
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        });

        if (reciprocalLike && reciprocalLike.from !== null) {
          mutualLikes.push(like);
        }
      }
    }

    // Clean up orphaned likes in the background (don't await to avoid blocking the response)
    const orphanedLikes = [
      ...likedByRaw.filter((like) => like.from === null),
      ...likedRaw.filter((like) => like.to === null),
    ];

    if (orphanedLikes.length > 0) {
      prisma.like
        .deleteMany({
          where: {
            id: {
              in: orphanedLikes.map((like) => like.id),
            },
          },
        })
        .catch((error) => {
          console.error("Error cleaning up orphaned likes:", error);
        });
    }

    return {
      likedBy: likedBy.map((like) => ({
        fromId: like.fromId,
        from: like.from,
      })),
      liked: liked.map((like) => ({
        toId: like.toId,
        to: like.to,
      })),
      mutualLikes: mutualLikes.map((like) => ({
        toId: like.toId,
        to: like.to,
      })),
    };
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
}
