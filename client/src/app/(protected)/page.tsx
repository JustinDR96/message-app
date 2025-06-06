import { FloatingChatBox } from "@/components/chat";
import UsersList from "@/components/UsersList/UsersList";

const Homepage = () => {
  return (
    <div className="flex items-start justify-between h-full border-2 border-red-500">
      <div className="border-3 w-full">Content</div>
      <aside className="flex flex-col w-50 border-2 overflow-auto ">
        <UsersList />
        <FloatingChatBox />
      </aside>
    </div>
  );
};

export default Homepage;
