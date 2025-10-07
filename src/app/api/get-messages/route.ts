import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";
// import { getServerSession } from "next-auth";// This will only work in less the version of ^5
// import { User } from "next-auth";

export async function GET(req: Request) {
  await dbConnect();

  // get current loggedIn user
  //   Use this only when you use authOptions in your auth.ts file
  //   const session = await getServerSession(auth);

  const session = await auth();
  console.log("In accept-messages - For getServerSession:: ", session);

  // const user: User = session?.user; // You can only do this with the next-auth version less than ^5.

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  // Whenever you do aggregation pipelines you do this
  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get messages",
      },
      { status: 500 }
    );
  }
}

// The diffrence between getServerSession() and auth()

// 1. getServerSession()
// This was the primary way to get the session on the server with the Pages Router. It's a general-purpose function that requires you to explicitly pass your authentication configuration (authOptions) to it every single time you use it.

// You should only really use getServerSession() in these scenarios:
// 1. You are using the Next.js Pages Router: If your project uses the pages directory (with functions like getServerSideProps), then getServerSession() is the correct tool to use. ||||  2. You are in a non-Next.js environment: If you were using Auth.js with another framework like SvelteKit or Express, you would use a similar pattern that requires passing your configuration.

// 2. auth()
// This is a newer, streamlined helper function introduced in Auth.js v5, designed specifically for the App Router. When you create your auth.ts file, the auth function is "pre-configured" with your options. It already knows your providers and callbacks, so you don't need to pass anything to it. It's simpler and cleaner.
