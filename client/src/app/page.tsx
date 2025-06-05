import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/toggleDarkMode";

export default function Home() {
  return (
    <main>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">
          Bienvenue sur ton app de messagerie
        </h1>
        <p className="text-gray-600">
          Next.js + Tailwind + ShadCN + TypeScript
        </p>
        <Button>Commencer</Button>
        <Link href={"/users"}>/users</Link>

        <ModeToggle />
      </div>
    </main>
  );
}
