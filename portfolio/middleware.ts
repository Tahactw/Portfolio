import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.login === process.env.GITHUB_ADMIN_USERNAME;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};