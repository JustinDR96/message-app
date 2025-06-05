"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

export default function ClientWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
