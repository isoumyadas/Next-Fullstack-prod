import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, verifyCode } = await req.json();

    // decode the component
    const decodedUsername = decodeURIComponent(username);

    const result = verifySchema.safeParse({ code: verifyCode });
    console.log("result: ", result);

    if (!result.success) {
      const verifyCodeErrors = result.error.format().code?._errors || [];
      console.error("verifyCode error:: ", verifyCodeErrors);
      return Response.json(
        {
          success: false,
          message: "ZOD error: Verification Code is not Correct",
        },
        { status: 400 }
      );
    }

    const { code } = result.data;

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account Verified Successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Incorrect Verification Code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
