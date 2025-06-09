import { PrismaClient } from "@/generated/prisma";
import Image from "next/image";
import AddMembersButton from "./AddMembersButton";

const prisma = new PrismaClient();

type Member = {
  id: string;
  name: string;
  image: string | null;
  city: string;
  country: string;
  description: string;
  user: {
    email: string;
  };
};

async function getMembers() {
  try {
    const members = await prisma.member.findMany({
      include: {
        user: true,
        photos: true,
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const members = await getMembers();

  if (members.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Members Dashboard</h1>
        <div className="text-center p-8">
          <p className="text-gray-600">
            No members found. Please add some members first.
          </p>
          <AddMembersButton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Members Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member: Member) => (
          <div key={member.id} className="border rounded-lg p-4 shadow-sm">
            <div className="relative w-full h-48 mb-4">
              <Image
                src={member.image || "/placeholder.jpg"}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="text-gray-600">{member.user.email}</p>
            <p className="text-sm text-gray-500">
              {member.city}, {member.country}
            </p>
            <p className="mt-2 line-clamp-3">{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
