/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AddMembersButton from "./AddMembersButton";
import {
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Filter,
  Users,
} from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LikeButton from "./LikeButton";
import FilterControls from "./FilterControls";

type Member = {
  id: string;
  userId: string;
  name: string;
  image: string | null;
  city: string;
  country: string;
  gender: string;
  dateOfBirth: Date;
  user: {
    email: string;
  };
  likedBy: {
    fromId: string;
  }[];
};

function calculateAge(dateOfBirth: Date) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

async function getMembers(
  genderFilter?: string,
  minAge?: number,
  maxAge?: number
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return [];
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

    // Calculate date range for age filtering
    let dateFilter = {};
    if (minAge !== undefined || maxAge !== undefined) {
      const today = new Date();
      const minDate = maxAge
        ? new Date(
            today.getFullYear() - maxAge - 1,
            today.getMonth(),
            today.getDate()
          )
        : undefined;
      const maxDate = minAge
        ? new Date(
            today.getFullYear() - minAge,
            today.getMonth(),
            today.getDate()
          )
        : undefined;

      if (minDate && maxDate) {
        dateFilter = {
          dateOfBirth: {
            gte: minDate,
            lte: maxDate,
          },
        };
      } else if (minDate) {
        dateFilter = {
          dateOfBirth: {
            gte: minDate,
          },
        };
      } else if (maxDate) {
        dateFilter = {
          dateOfBirth: {
            lte: maxDate,
          },
        };
      }
    }

    // Build where clause
    const whereClause: {
      id: { not: string };
      dateOfBirth?: { gte?: Date; lte?: Date };
      gender?: string;
    } = {
      id: {
        not: currentMember.id,
      },
      ...dateFilter,
    };

    // Add gender filter if specified
    if (genderFilter && genderFilter !== "All") {
      whereClause.gender = genderFilter;
    }

    const members = await prisma.member.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            email: true,
          },
        },
        likedBy: {
          where: {
            fromId: currentMember.id,
          },
        },
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

const cardColors = [
  "bg-[#FFD7E9]",
  "bg-[#F0C0FE]",
  "bg-pink-300",
  "bg-[#F1DDCF]",
  "bg-[#E0F2F1]",
  "bg-[#FFE0B2]",
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string; minAge?: string; maxAge?: string }>;
}) {
  const { gender, minAge, maxAge } = await searchParams;
  const genderFilter = gender || "All";
  const minAgeFilter = minAge ? parseInt(minAge) : undefined;
  const maxAgeFilter = maxAge ? parseInt(maxAge) : undefined;

  const members = await getMembers(genderFilter, minAgeFilter, maxAgeFilter);
  const session = await getSession();
  if (!session) {
    redirect("/Sign-in");
  }

  console.log(session);
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block bg-pink-300 px-4 py-1 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Our Members
          </div>
          <h1 className="text-4xl font-bold mb-4">Meet Amazing People</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-600 mb-6">
            Discover our vibrant community of singles ready to connect and find
            their perfect match!
          </p>

          {/* Filter Controls */}
          <FilterControls
            currentGender={genderFilter}
            currentMinAge={minAgeFilter}
            currentMaxAge={maxAgeFilter}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Users className="w-4 h-4 text-pink-500" />
            <span className="font-medium">
              {members.length} {members.length === 1 ? "person" : "people"}{" "}
              found
            </span>
            {(genderFilter !== "All" || minAge || maxAge) && (
              <span className="text-sm text-gray-500 ml-2">(filtered)</span>
            )}
          </div>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              {genderFilter !== "All" || minAge || maxAge
                ? "No members match your current filters. Try adjusting your preferences!"
                : "No members found. Add some members to get started!"}
            </p>
            {genderFilter === "All" && !minAge && !maxAge && (
              <AddMembersButton />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
              <div
                key={member.id}
                className={`${
                  cardColors[index % cardColors.length]
                } rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
              >
                <Link href={`/dashboard/${member.userId}`}>
                  <div className="relative mb-4">
                    <div className="w-full aspect-square rounded-lg border-2 border-black overflow-hidden bg-white">
                      <Image
                        src={member.image || "/images/placeholder.jpg"}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3">
                      <LikeButton
                        memberId={member.id}
                        initialLiked={member.likedBy.length > 0}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">
                        {member.name}, {calculateAge(member.dateOfBirth)}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          member.gender === "Female"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {member.gender}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mr-1"></div>
                      <span className="text-gray-600">
                        {member.city}, {member.country}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex gap-2 pt-4 mt-4 border-t-2 border-black">
                  <Link
                    href={`/dashboard/${session.user.id}/chat?target=${member.userId}`}
                    className="flex-1 bg-blue-300 px-3 py-2 rounded-lg border-2 border-black flex items-center justify-center gap-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Chat</span>
                  </Link>
                  <Link
                    href={`/dashboard/${member.userId}/Photos`}
                    className="flex-1 bg-purple-300 px-3 py-2 rounded-lg border-2 border-black flex items-center justify-center gap-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm">Photos</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
