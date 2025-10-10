// You can put this file name as auth.ts or options. you can put this file in lib folder or in the src folder.

import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";

if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
  throw new Error("Missing GitHub OAuth environment variables");
}

// You can also use NextAuthOption
// export const authOptions: NextAuthOptions= {}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
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

          // Explicitly var to strings for the issue geting on credentials.password

          const passFromCred = String(credentials.password);

          // Checking the password
          const isValidPass = await bcrypt.compare(passFromCred, user.password);

          if (!isValidPass) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error: any) {
          // This is a security risk. If a database error occurs, this could leak sensitive information about your database structure or connection to the client. You should always throw a generic error message from the authorize function.
          console.error("Authorize error: ", error);
          throw new Error("An error occurred during authentication.");
        }
      },
    }),
  ],
  // pages: {
  //   signIn: "/sign-in", // you are now responsible for creating the actual login page. You must create a file at app/login/page.tsx that contains your custom login form.
  // },
  session: {
    strategy: "jwt", // This mean i want to keep my session saved in jwt.
    maxAge: 30 * 24 * 60 * 60,
  },
  // secret: process.env.AUTH_SECRET, // You can use AUTH_SECRET in your envfile which is picked automatically.
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
});

// The Credentials provider is unique because it doesn't rely on an external service like Google. Instead, it relies on you to provide a function that verifies a user's credentials against your own database. This function is called authorize.

// The object you return from authorize is only used to create the initial token. It is not automatically persisted in the session. You must use callbacks to control what data is available in the session.

// To add extra data in session you use callback for that you have to follow
// The flow : authorize -> jwt callback -> session callback.

// 1. jwt Callback: This is triggered after a successful sign-in. Its job is to take the user object from authorize and add its properties to the JWT.

// 2. session Callback: This is triggered whenever the session is accessed (useSession or auth()). Its job is to take the data from the JWT (the token) and make it available in the final session object.

//  when you call auth() on the server or useSession() on the client, the returned session object will include the user's ID: session.user.id.
