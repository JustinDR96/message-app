import FloatingChatBox from "@/components/chat/FloatingChatBox";
import UserSidebar from "@/components/shared/UserSidebar";

export default function UsersPage() {
  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Page principale</h1>
        {/* autre contenu */}
      </main>

      <UserSidebar />

      <FloatingChatBox />
    </div>
  );
}
