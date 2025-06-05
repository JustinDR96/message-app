// client/lib/prisma.ts

// ❌ Prisma ne doit pas être utilisé côté client.
// Ce fichier empêche les erreurs d'import en développement,
// mais lève une erreur claire si jamais il est utilisé par erreur.

export const prisma = new Proxy(
  {},
  {
    get() {
      throw new Error(
        "❌ Vous avez tenté d'utiliser Prisma côté client. Ce n'est pas autorisé. Supprimez l'import de '@/lib/prisma'."
      );
    },
  }
);
