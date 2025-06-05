import Chat from "@/components/chat/Chat";

export default function Page({
  params,
}: {
  params: { conversationId: string };
}) {
  return (
    <div className="max-w-lg mx-auto p-4">
      <Chat conversationId={params.conversationId} />
    </div>
  );
}
