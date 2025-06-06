"use client";

import Link from "next/link";
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

const Navbar = () => {
  const { data: session, status } = useSession();

  console.log("Session data:", session);
  return (
    <nav className="flex items-center justify-between p-4">
      <h2>
        <Link href={"/"}>WhatzApp</Link>
      </h2>
      <ul className="flex space-x-4 items-center">
        <li>
          <Link href="/users">Users</Link>
        </li>
        <li>
          <ModeToggle />
        </li>
        <li className="border-2 flex items-center">
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
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: "/login" })}
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