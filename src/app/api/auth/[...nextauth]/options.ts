import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbconnect from "@/lib/dbConect";
import UserModal from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbconnect();
        try {
          const user = await UserModal.findOne({
            $or: [
              { email: credentials.identifier },
              { userName: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("Invalid credentials");
          }
          if (!user.isVarified) {
            throw new Error("User is not varified");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }
          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVarified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
        if (token) {
        session.user._id = token._id;
        session.user.isVarified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.userName = token.userName;
      }
      return session;
    },
  },
};
