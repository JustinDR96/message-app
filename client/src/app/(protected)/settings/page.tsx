"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [imageUrl, setImageUrl] = useState(session?.user?.image ?? "");

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Photo de profil</h1>

      <Avatar className="w-20 h-20">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>
          {session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>

      <UploadButton<OurFileRouter>
        endpoint="profileImage"
        onClientUploadComplete={async (res) => {
          const url = res[0].url || res[0].ufsUrl; // sécurité future
          setImageUrl(url);

          await fetch("/api/user/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: url }),
          });

          await update(); // <-- force le refresh de session next-auth
          alert("Image mise à jour !");
        }}
        onUploadError={(err) => {
          alert("Erreur : " + err.message);
        }}
      />
    </div>
  );
}
