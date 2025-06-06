import { FloatingChatBox } from "@/components/chat";
import UsersList from "@/components/UsersList/UsersList";
console.log("FloatingChatBox ===>", FloatingChatBox); // 🔍

export default function UsersPage() {
  console.log("✅ Je suis dans UsersPage");
  return (
    <div className="flex">
      <UsersList />
      {FloatingChatBox ? <FloatingChatBox /> : "FloatingChatBox is undefined"}
    </div>
  );
}
