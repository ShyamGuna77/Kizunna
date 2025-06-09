/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { membersData } from "../../../../prisma/membersData";

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
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // First, check if we already have members
    const existingMembers = await prisma.member.count();
    if (existingMembers > 0) {
      return NextResponse.json(
        { message: "Members already exist" },
        { status: 400 }
      );
    }

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
      count: members.length,
    });
  } catch (error) {
    console.error("Error creating members:", error);
    return NextResponse.json(
      { error: "Failed to create members" },
      { status: 500 }
    );
  }
}
