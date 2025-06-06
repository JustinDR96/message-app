"use client";

import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/toggleDarkMode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import images from "@/assets";

const Navbar = () => {
  const { data: session, status } = useSession();

  console.log("Session data:", session);
  return (
    <nav className="flex items-center justify-between p-4 h-16 border-b border-gray-200">
      <h2>
        <Link href="/" className="flex items-center">
          <Image
            src={images.logoNoBg}
            alt="Logo de l'application"
            width={50}
            height={50}
          />
          StackChat
        </Link>
      </h2>
      <ul className="flex space-x-4 items-center">
        <li>
          <Link href="/users">Users</Link>
        </li>
        <li>
          <ModeToggle />
        </li>
        <li className="flex items-center">
          {status === "authenticated" && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image ?? ""}
                    alt="Photo utilisateur"
                  />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/settings"}>Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="destructive"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="cursor-pointer"
                  >
                    Se déconnecter
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
