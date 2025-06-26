import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Eye, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getLikes } from "@/app/actions/likeActions";

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

async function getMemberPhotos(memberId: string) {
  try {
    const photos = await prisma.photo.findMany({
      where: { memberId },
      orderBy: { id: "asc" },
    });
    return photos;
  } catch (error) {
    console.error("Error fetching member photos:", error);
    return [];
  }
}

export default async function MatchesPage() {
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

  // Get likes data
  const likesData = await getLikes();
  const { likedBy, mutualLikes } = likesData;

  // Get photos for each user who liked you
  const usersWithPhotos = await Promise.all(
    likedBy.map(async (like) => {
      const photos = await getMemberPhotos(like.from.id);
      return {
        ...like.from,
        photos,
        isMutual: mutualLikes.some((mutual) => mutual.toId === like.from.id),
      };
    })
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
          <h1 className="text-3xl font-bold">Your Matches</h1>
          <p className="text-gray-600 mt-2">
            People who liked your pictures ({likedBy.length})
          </p>
        </div>

        {likedBy.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-black p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold mb-4">No Likes Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When someone likes your pictures, they&apos;ll appear here. Start by
              adding some great photos to your profile!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-pink-300 px-6 py-3 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Browse Members
              </Link>
              <Link
                href={`/dashboard/${currentUserMember.userId}/Photos`}
                className="bg-purple-300 px-6 py-3 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Add Photos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usersWithPhotos.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden"
              >
                {/* Main Photo */}
                <div className="relative h-64 bg-gradient-to-br from-pink-100 to-purple-100">
                  {user.photos.length > 0 ? (
                    <Image
                      src={user.photos[0].url}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src={user.image || "/images/placeholder.jpg"}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Mutual Like Badge */}
                  {user.isMutual && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold border border-black flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Mutual
                    </div>
                  )}

                  {/* Photo Count Badge */}
                  {user.photos.length > 0 && (
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {user.photos.length} photo
                      {user.photos.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg truncate">{user.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {user.city}, {user.country}
                      </span>
                    </div>
                  </div>

                  {/* Additional Photos Preview */}
                  {user.photos.length > 1 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {user.photos.slice(1, 4).map((photo, index) => (
                        <div
                          key={photo.id}
                          className="relative w-16 h-16 rounded-lg border-2 border-black overflow-hidden flex-shrink-0"
                        >
                          <Image
                            src={photo.url}
                            alt={`${user.name} photo ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {user.photos.length > 4 && (
                        <div className="relative w-16 h-16 rounded-lg border-2 border-black bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gray-600">
                            +{user.photos.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/${user.userId}/Photos`}
                      className="flex-1 bg-purple-300 px-3 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Photos
                    </Link>
                    <Link
                      href={`/chats?target=${user.userId}`}
                      className="flex-1 bg-blue-300 px-3 py-2 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                Find new people to connect with
              </p>
            </Link>
            <Link
              href="/chats"
              className="bg-blue-300 p-4 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <h3 className="font-bold mb-2">View Chats</h3>
              <p className="text-sm text-gray-600">Check your conversations</p>
            </Link>
            <Link
              href={`/dashboard/${currentUserMember.userId}/Photos`}
              className="bg-purple-300 p-4 rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <h3 className="font-bold mb-2">Manage Photos</h3>
              <p className="text-sm text-gray-600">
                Add or update your pictures
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
