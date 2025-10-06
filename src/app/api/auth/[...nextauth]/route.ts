// import NextAuth from "next-auth";
// import authOptions from "@/auth"

// const { handlers, auth } = NextAuth(authOptions);
// export { handlers as GET, handlers as POST, auth };

import { handlers } from "@/auth";
export const { GET, POST } = handlers;
