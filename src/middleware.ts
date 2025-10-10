import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// 1. Get the secret from environment variables
const secret = process.env.AUTH_SECRET;

// 2. Add a check to ensure the secret exists
if (!secret) {
  throw new Error(
    "AUTH_SECRET is not set in your environment variables. Please add it to your .env.local file."
  );
}

export async function middleware(request: NextRequest) {
  // 3. Pass the validated secret to getToken
  const token = await getToken({
    req: request,
    secret: secret,
  });

  console.log("token: ", token);

  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};

//========================== withAuth example ================================

// import withAuth from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware() {
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         const { pathname } = req.nextUrl;

//         // allowed
//         if (
//           pathname.startsWith("/sign-in") ||
//           pathname.startsWith("/sign-up") ||
//           pathname.startsWith("/verify") ||
//           pathname.startsWith("/")
//         ) {
//           return true;
//         }

//         // public
//         // if() {
//         //   return true
//         // }

//         return !!token;
//       },
//     },
//   }
// );

// export const config = {
//   matcher: [

//   ]
// }
