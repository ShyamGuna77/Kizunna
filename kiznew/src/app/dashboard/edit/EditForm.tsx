"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, } from "lucide-react";
import { updateProfile, deletePhoto } from "./actions";

interface EditFormProps {
  member: {
    id: string;
    userId: string;
    name: string;
    gender: string;
    dateOfBirth: Date;
    description: string;
    city: string;
    country: string;
    image: string | null;
    photos: { id: string; url: string }[];
  };
}

function EditForm({ member }: EditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    member.image
  );
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<
    string[]
  >(member.photos.map((photo) => photo.url));

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagesPreview((prev) => [
          ...prev,
          reader.result as string,
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("userId", member.userId);

    const result = await updateProfile(formData);
    setIsLoading(false);

    if (result.success) {
      router.push(`/dashboard/${member.userId}`);
      router.refresh();
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const result = await deletePhoto(photoId, member.userId);
    if (result.success) {
      setAdditionalImagesPreview((prev) =>
        prev.filter((_, index) => member.photos[index].id !== photoId)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Profile Image */}
          <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-bold mb-4">Profile Image</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-xl border-2 border-black overflow-hidden">
                <Image
                  src={mainImagePreview || "/images/placeholder.jpg"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    name="mainImage"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-2 file:border-black
                      file:text-sm file:font-semibold
                      file:bg-pink-300 file:text-black
                      hover:file:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                      file:transition-all"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Additional Photos */}
          <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-bold mb-4">Additional Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {additionalImagesPreview.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full aspect-square rounded-xl border-2 border-black overflow-hidden">
                    <Image
                      src={url}
                      alt={`Additional photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {member.photos[index] && (
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(member.photos[index].id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-lg border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <label className="block">
              <span className="sr-only">Add more photos</span>
              <input
                type="file"
                name="additionalImages"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-2 file:border-black
                  file:text-sm file:font-semibold
                  file:bg-purple-300 file:text-black
                  hover:file:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  file:transition-all"
              />
            </label>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={member.name}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  defaultValue={member.gender}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  defaultValue={
                    new Date(member.dateOfBirth).toISOString().split("T")[0]
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  defaultValue={member.city}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  defaultValue={member.country}
                  className="w-full px-4 py-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-bold mb-4">About Me</h2>
            <textarea
              name="description"
              defaultValue={member.description}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-pink-300 px-8 py-3 rounded-lg border-2 border-black font-bold hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditForm;
