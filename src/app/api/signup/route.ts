import dbconnect from "@/lib/dbConect";
import UserModal from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmil } from "@/helpers/sendVerificationEmail";

export const POST = async (request: Request) => {
  await dbconnect();

  try {
    const { userName, password, email } = await request.json();
    let isUpdated = false;

    // Check if the user already exists
    const existingUser = await UserModal.findOne({
      userName,
      isVarified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "UserName already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserbyemail = await UserModal.findOne({
      email,
    });
    const varifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserbyemail) {
      if (existingUserbyemail?.isVarified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        isUpdated = true;
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserbyemail.password = hashedPassword;
        existingUserbyemail.varifyCode = varifyCode;
        existingUserbyemail.varifyCodeExpiry = new Date(
          Date.now() + 10 * 60 * 1000
        );
        await existingUserbyemail.save();
      }
    } else {
      const varifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModal({
        userName,
        password: hashedPassword,
        email,
        varifyCode,
        varifyCodeExpiry,
        isAcceptingMessages: true,
        isVarified: false,
        messages: [],
      });
      await newUser.save();
    }

    // Send verification email
    const { success, message } = await sendVerificationEmil(
      email,
      userName,
      varifyCode
    );
    if (success) {
      return Response.json(
        {
          success: true,
          message: `User ${isUpdated ? "updated" : "created"} successfully`,
        },
        {
          status: 201,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: message,
        },
        {
          status: 500,
        }
      );
    }
    //
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "UserName already exists",
      },
      {
        status: 500,
      }
    );
  }
};
