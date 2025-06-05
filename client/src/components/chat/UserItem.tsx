"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  user: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  };
  isOnline: boolean;
  onClick: () => void;
};

export default function UserItem({ user, isOnline, onClick }: Props) {
  return (
    <div className="relative w-full">
      <Button
        variant="ghost"
        className="w-full justify-start pl-12 gap-2"
        onClick={onClick}
      >
        <Avatar className="w-6 h-6">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback>{user.name?.[0] ?? user.email[0]}</AvatarFallback>
        </Avatar>
        {user.name ?? user.email}
      </Button>

      <span
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white",
          isOnline ? "bg-green-500" : "bg-red-500"
        )}
      />
    </div>
  );
}
