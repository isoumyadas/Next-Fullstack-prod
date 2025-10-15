"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const onLogout = async () => {
    const res = await signOut({ redirect: false });

    if (res) {
      toast.success("User logged out successfully");
      router.replace("/sign-in");
    } else {
      toast.error("Error while logging out");
    }
  };

  const user = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={onLogout}
              className="w-full md:w-auto bg-slate-100 text-black cursor-pointer"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href={"/sign-in"}>
            <Button
              className="w-full md:w-auto bg-slate-100 text-black cursor-pointer"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
