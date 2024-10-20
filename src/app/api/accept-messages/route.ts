import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbConect";
import UserModal from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbconnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModal.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Faild to updated user status to accept messages",
          updatedUser
        },
        { status: 200 }
      );
    }

    return Response.json(
        {
          success: true,
          message: "Message acceptance status updated successfully",
        },
        { status: 401 }
      );
  } catch (error) {
    console.error("Faild to updated user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Faild to updated user status to accept messages",
      },
      { status: 500 }
    );
  }
}
