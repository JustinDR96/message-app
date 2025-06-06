// app/loading.tsx
import { Spinner } from "@/components/Spinner";

export default function Loading() {

    
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
