import React from "react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

async function getMember(userId: string) {
  try {
    const member = await prisma.member.findFirst({
      where: {
        userId: userId,
      },
      include: {
        photos: true,
      },
    });
    return member;
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
}

export default async function EditPage() {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/Sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/Sign-in");
  }

  const member = await getMember(user.id);

  if (!member) {
    redirect("/dashboard");
  }

  return <EditForm member={member} />;
}
