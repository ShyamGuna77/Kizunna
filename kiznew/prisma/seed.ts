import { PrismaClient } from "@prisma/client";
import { membersData } from "./membersData";
// import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function seedMembers() {
  try {
    const promises = membersData.map((member) =>
      prisma.user.create({
        data: {
          email: member.email,
          emailVerified: true,
          name: member.name,
          image: member.image,
          createdAt: new Date(),
          updatedAt: new Date(),
          member: {
            create: {
              dateOfBirth: new Date(member.dateOfBirth),
              gender: member.gender,
              name: member.name,
              created: new Date(member.created),
              updated: new Date(member.lastActive),
              description: member.description,
              city: member.city,
              country: member.country,
              image: member.image,
              photos: {
                create: {
                  url: member.image,
                },
              },
            },
          },
        },
      })
    );

    await Promise.all(promises);
    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedMembers();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
