import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientWrapper from "@/components/shared/ClientWrapper";
import Navbar from "@/components/shared/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <ClientWrapper session={session}>
      <Navbar />
      {children}
    </ClientWrapper>
  );
}
