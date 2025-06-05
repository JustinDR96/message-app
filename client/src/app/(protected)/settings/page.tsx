"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { updateUserImage } from "@/services/api/userImage";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [imageUrl, setImageUrl] = useState(session?.user?.image ?? "");
  console.log("Coucou depuis la page dashboard");

  return (
    <div>
      <h1 className="text-2xl font-bold">Photo de profil</h1>

      <Avatar className="w-20 h-20">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>
          {session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>

      <UploadButton<OurFileRouter, "profileImage">
        endpoint="profileImage"
        onClientUploadComplete={async (res) => {
          const url = res[0].url || res[0].ufsUrl;
          setImageUrl(url);

          if (!session?.user?.email) {
            alert("Session invalide, veuillez vous reconnecter");
            return;
          }

          try {
            await updateUserImage(session.user.email, url);
            await update();
            alert("Image mise à jour !");
          } catch (err: any) {
            alert("Erreur : " + err.message);
          }
        }}
        onUploadError={(err) => {
          alert("Erreur : " + err.message);
        }}
      />
    </div>
  );
}
