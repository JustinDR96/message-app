"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.message || "Erreur inconnue");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen p-4 ">
      <Card className="w-full max-w-sm">
        <CardHeader className="w-full flex flex-col items-center">
          <CardTitle>Créez votre compte</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Mot de passe"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <Button className="w-full mt-6" type="submit">
              Creez un compte
            </Button>
          </form>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>

        <CardFooter>
          <Button
            variant={"link"}
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Se connecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
