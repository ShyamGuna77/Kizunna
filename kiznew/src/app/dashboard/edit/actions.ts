/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const description = formData.get("description") as string;
    const city = formData.get("city") as string;
    const country = formData.get("country") as string;
    const mainImage = formData.get("mainImage") as File;
    const additionalImages = formData.getAll("additionalImages") as File[];

    let mainImageUrl = undefined;
    if (mainImage && mainImage.size > 0) {
      const bytes = await mainImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "dating-app",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          )
          .end(buffer);
      });

      mainImageUrl = (result as any).secure_url;
    }

    const member = await prisma.member.update({
      where: { userId },
      data: {
        name,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        description,
        city,
        country,
        ...(mainImageUrl && { image: mainImageUrl }),
      },
    });

    // Handle additional images
    if (additionalImages.length > 0) {
      for (const image of additionalImages) {
        if (image.size > 0) {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "dating-app",
                  resource_type: "image",
                },
                (error, result) => {
                  if (error) reject(error);
                  resolve(result);
                }
              )
              .end(buffer);
          });

          await prisma.photo.create({
            data: {
              url: (result as any).secure_url,
              publicId: (result as any).public_id,
              memberId: member.id,
            },
          });
        }
      }
    }

    revalidatePath(`/dashboard/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function deletePhoto(photoId: string, userId: string) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (photo?.publicId) {
      await cloudinary.uploader.destroy(photo.publicId);
    }

    await prisma.photo.delete({
      where: { id: photoId },
    });

    revalidatePath(`/dashboard/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting photo:", error);
    return { success: false, error: "Failed to delete photo" };
  }
}
