// // src/lib/auth-options-client.ts
// import { NextAuthOptions } from "next-auth";

// // version simplifiée, sans import de prisma ni bcrypt
// export const authOptions: NextAuthOptions = {
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.image = user.image;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id as string;
//       session.user.name = token.name as string;
//       session.user.image = token.image as string;
//       return session;
//     },
//   },
// };
