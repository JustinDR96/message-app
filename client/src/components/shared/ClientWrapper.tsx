"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Navbar from "@/components/shared/Navbar";

export default function ClientWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      {children}
    </SessionProvider>
  );
}
