import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
// import { getServerSession } from "next-auth";// This will only work in less the version of ^5
// import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  // get current loggedIn user
  //   Use this only when you use authOptions in your auth.ts file
  //   const session = await getServerSession(auth);

  const session = await auth();
  console.log("In accept-messages POST - For getServerSession:: ", session);

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

  const userId = session.user._id;

  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isAcceptingMessages: acceptMessages } },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not available",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  // get current loggedIn user
  //   Use this only when you use authOptions in your auth.ts file
  //   const session = await getServerSession(auth);

  const session = await auth();
  console.log("In accept-messages GET - For getServerSession:: ", session);

  // const user: User = session?.user; // You can only do this with the next-auth version less than ^5.
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "In GET-Accept-Messages:: Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = session.user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "In GET-Accept-Messages:: User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting accepting message ",
      },
      { status: 500 }
    );
  }
}
