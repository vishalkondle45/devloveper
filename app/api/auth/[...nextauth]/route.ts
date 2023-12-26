import startDb from "@/lib/db";
import UserModel from "@/models/User";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req): Promise<any> {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        await startDb();

        const user = await UserModel.findOne({ email });
        if (!user) throw Error("email/password mismatch!");

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw Error("email/password mismatch!");

        return {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          _id: user._id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.name = session.name;
        token.email = session.email;
      }
      if (user) {
        token._id = user._id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST, authOptions };
