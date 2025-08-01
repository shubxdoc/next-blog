import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { upload } from "@imagekit/next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const UploadImage = async (file: File) => {
  const res = await fetch("/api/imagekit-auth");
  if (!res.ok) throw new Error("Auth failed");

  const { token, expire, signature, publicKey } = await res.json();

  try {
    const result = await upload({
      file,
      fileName: file.name,
      token,
      expire,
      signature,
      publicKey,
    });

    return result.url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Image upload failed");
  }
};
