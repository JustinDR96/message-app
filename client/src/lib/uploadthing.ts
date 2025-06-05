import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "2MB" } })
    .middleware(async ({ req }) => {
      const token = await getToken({ req: req as NextRequest });
      if (!token?.sub) throw new Error("Unauthorized");

      return { userId: token.sub };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("✅ Upload terminé :", file.url);
      // Tu peux appeler ta DB ici si tu veux stocker l'URL
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
