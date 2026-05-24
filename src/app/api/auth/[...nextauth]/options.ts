import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }

  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",

      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter email or username",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
          }).select("+password");

          if (!user) {
            throw new Error("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before login");
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordCorrect) {
            return user;
          }

          throw new Error("Incorrect password");
        } catch (error: any) {
          throw new Error(error.message || "Authentication Failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
