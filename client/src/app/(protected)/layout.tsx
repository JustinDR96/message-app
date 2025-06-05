import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ClientWrapper from "@/components/shared/ClientWrapper";
import ClientLayout from "./client-layout";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ClientWrapper session={session}>
      <ClientLayout defaultOpen={defaultOpen}>{children}</ClientLayout>
    </ClientWrapper>
  );
}
