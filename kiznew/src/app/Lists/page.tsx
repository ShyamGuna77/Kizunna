import { getLikes } from "../actions/likeActions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Member = {
  userId: string;
  name: string;
  image: string | null;
  city: string;
  country: string;
};

export default async function ListsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/Sign-in");
  }

  const { likedBy, liked, mutualLikes } = await getLikes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Your Likes</h1>
          <p className="text-xl text-gray-600">
            Discover who liked you and your matches!
          </p>
        </div>

        <Tabs defaultValue="mutual" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="mutual">Mutual Likes</TabsTrigger>
            <TabsTrigger value="liked">You Liked</TabsTrigger>
            <TabsTrigger value="likedBy">Liked You</TabsTrigger>
          </TabsList>

          <TabsContent value="mutual">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mutualLikes.map((like) => (
                <MemberCard key={like.toId} member={like.to} />
              ))}
              {mutualLikes.length === 0 && (
                <p className="col-span-2 text-center text-gray-500 py-8">
                  No mutual likes yet. Keep exploring!
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="liked">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liked.map((like) => (
                <MemberCard key={like.toId} member={like.to} />
              ))}
              {liked.length === 0 && (
                <p className="col-span-2 text-center text-gray-500 py-8">
                  You haven&apos;t liked anyone yet.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="likedBy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {likedBy.map((like) => (
                <MemberCard key={like.fromId} member={like.from} />
              ))}
              {likedBy.length === 0 && (
                <p className="col-span-2 text-center text-gray-500 py-8">
                  No one has liked you yet.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <Link
      href={`/dashboard/${member.userId}`}
      className="bg-white rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg border-2 border-black overflow-hidden">
          <Image
            src={member.image || "/placeholder.png"}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg">{member.name}</h3>
          <p className="text-sm text-gray-600">
            {member.city}, {member.country}
          </p>
        </div>
      </div>
    </Link>
  );
}
