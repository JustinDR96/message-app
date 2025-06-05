"use client";

import { signIn } from "next-auth/react";
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

export default function LoginPage() {
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

    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.error) {
      setError("Identifiants invalides");
    } else {
      router.push("/"); // à adapter selon ta page d'accueil privée
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen p-4 ">
      <Card className="w-full max-w-sm">
        <CardHeader className="w-full flex flex-col items-center">
          <CardTitle>Connectez vous a votre compte</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {" "}
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
              Se Connecter
            </Button>
          </form>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>

        <CardFooter>
          <Button
            variant={"link"}
            className="w-full"
            onClick={() => router.push("/register")}
          >
            Créer un compte
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
