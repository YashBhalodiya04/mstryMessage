import dbconnect from "@/lib/dbConect";
import UserModal from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchemas";

const UsernameQuerySchemas = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbconnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchemas.safeParse(queryParam);
    if (!result.success) {
      const errors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            errors?.length > 0 ? errors.join(",") : "Invalid query parameters",
        },
        { status: 400 }
      );
    } else {
      const user = await UserModal.findOne({
        username: result.data.username,
        isVarified: true,
      });
      if (user) {
        return Response.json(
          {
            success: false,
            message: "Username is already taken",
          },
          { status: 400 }
        );
      } else {
        return Response.json(
          {
            success: true,
            message: "Username is available",
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Error check username", error);
    return Response.json({
      success: false,
      message: "Error check username",
    });
  }
}
