import "next-auth";
import { DefaultSession } from "next-auth";

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

// why we need to do this?
// we have to do this because TypeScript needs to know the exact "shape" of your objects. By default, Auth.js only defines the Session and User types with standard properties like name, email, and image. It has no knowledge of the custom data you add from your database, such as _id or username.

// You are essentially telling TypeScript, "In my project, the Session object will also contain these extra fields."
