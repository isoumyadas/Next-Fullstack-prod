// It's a good practice to create a dedicated file for all your context providers.

// app/providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // The SessionProvider component provides the session data to all its children.
  return <SessionProvider>{children}</SessionProvider>;
}
