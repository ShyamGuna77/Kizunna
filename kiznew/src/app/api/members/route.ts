/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { membersData } from "../../../../prisma/membersData";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        user: true,
        photos: true,
      },
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const members = await Promise.all(
      membersData.map(async (member) => {
        return prisma.user.create({
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
        });
      })
    );
    return NextResponse.json({
      message: "Members created successfully",
      members,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create members" },
      { status: 500 }
    );
  }
}
