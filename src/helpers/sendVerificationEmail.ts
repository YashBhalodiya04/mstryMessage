import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export const sendVerificationEmil = async (
  email: string,
  username: string,
  varifyCode: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Verify your email on mstrymessage",
      react: VerificationEmail({ username, varifyCode }),
    });
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.log("Email sending failed", error);
    return {
      success: false,
      message: "Email sending failed",
    };
  }
};
