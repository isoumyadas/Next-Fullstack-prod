import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;

  await dbConnect();

  const session = await auth();
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const updatedRes = await UserModel.updateOne(
      { _id: user?._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedRes.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Message Deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in delete-message:: ", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
