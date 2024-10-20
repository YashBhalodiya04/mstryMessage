import {NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    if (token && (url.pathname === "/signin" || url.pathname === "/signup" || url.pathname === "/" || url.pathname === "/varify/:path*")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!token && (url.pathname === "/dashboard" || url.pathname === "/dashboard/:path*")) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/signin", "/signup", "/", "/dashboard/:path*","/varify/:path*"],
};
