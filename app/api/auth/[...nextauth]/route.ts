import startDb from "@/lib/db";
import UserModel from "@/models/User";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
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
        console.log(user);

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
    jwt(params: any) {
      if (params.user?.isAdmin) {
        params.token.isAdmin = params.user.isAdmin;
        params.token._id = params.user._id;
      }
      return params.token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { _id: string })._id = token._id as string;
        (session.user as { isAdmin: boolean }).isAdmin =
          token.isAdmin as boolean;
      }
      return session;
    },
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
