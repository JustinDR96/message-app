import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "2MB" } })
    .middleware(async ({ req }) => {
      const token = await getToken({ req: req as NextRequest });
      if (!token || !token.sub) throw new Error("Unauthorized");

      return { userId: token.sub };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload terminé :", file.url);
      // Tu peux ajouter ici un appel DB si tu veux
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
