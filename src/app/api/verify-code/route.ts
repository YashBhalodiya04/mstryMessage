import dbconnect from "@/lib/dbConect";
import UserModal from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchemas";

export async function POST(request: Request) {
  await dbconnect();
  try {
    const { username, code } = await request.json();
    const decodedusername = decodeURIComponent(username);
    const user = await UserModal.findOne({
      username: decodedusername,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.varifyCode === code;
    const isCodeNotExpired = new Date(user.varifyCodeExpiry) < new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVarified = true;
      await user.save();
      return Response.json({
        success: true,
        message: "User verified successfully",
      });
    } else {
      return Response.json({
        success: false,
        message: "Invalid code or code expired",
      });
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json({
      success: false,
      message: "Error verifying user",
    });
  }
}
