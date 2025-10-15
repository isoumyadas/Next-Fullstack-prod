// Using zod here for checking

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import z from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

// GET method to check the if username is unque or if the username exists

export async function GET(req: Request) {
  // use this in all routes || applies in pages router

  if (req.method !== "GET") {
    return Response.json(
      { success: false, message: "Only GET method allowed" },
      { status: 405 }
    );
  }

  await dbConnect();

  try {
    // This is how we get query param in server component
    const { searchParams } = new URL(req.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("result: ", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.error("username error:: ", usernameErrors);

      return Response.json(
        { success: false, message: usernameErrors },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username is alreay taken" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username ", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
