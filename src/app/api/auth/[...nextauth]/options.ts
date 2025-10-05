import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jhonsmith@email.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          await dbConnect();

          const user = await UserModel.findOne({
            // $or: [
            //   { email: credentials.email },
            //   {username: credentials.identifier}
            // ],

            email: credentials.email,
          });

          if (!user) {
            throw new Error("No user found");
          }

          // If user is not verified

          if (!user.isVerified) {
            throw new Error("Please verify your email before login");
          }

          // Checking the password
          const isValidPass = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPass) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },
  },
};
