"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // for navigation
  const router = useRouter();

  // zod implementation

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  // submit method

  const onLoginSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    console.log("data =>>>>>>>>>>> ", data.email);
    console.log("data 2 =>>>>>>>>>>> ", data.password);

    // The signIn function returns a result object, it doesn't throw an error on failure.
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (res?.error) {
      toast.error("Invalid identifier or password", {
        style: { background: "red" },
      });
    } else if (res?.ok) {
      toast.success("Login successful!", {
        style: { background: "green" },
      });
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Login
          </h1>
          <p className="mb-4">Login to start your first anonymous adventure</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onLoginSubmit)}
            className="space-y-6"
          >
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  {/* <FormControl> */}
                  <Input
                    placeholder="sammy@email.com"
                    {...field}
                    name="email"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {/* </FormControl> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  {/* <FormControl> */}
                  <Input
                    type="password"
                    {...field}
                    name="password"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {/* </FormControl> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sign in Button */}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "SignIn"
              )}
            </Button>

            <div className="flex justify-center gap-6">
              {/* Github Button */}
              <Button type="submit" className="cursor-pointer" disabled={true}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Github"
                )}
              </Button>

              <Button type="submit" className="cursor-pointer" disabled={true}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Google"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New User?{" "}
            <Link
              href={"/sign-up"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// your @/auth file runs only on the server, while your sign-in page runs in the user's browser. You cannot directly import server code into browser code.

// Your @/auth file is the Kitchen 👨‍🍳. It contains all your secret recipes and powerful tools (bcrypt, database secrets, fs). For security, customers are never allowed in the kitchen.

// Your sign-in/page.tsx is the Customer at the Table 🍽️. They are in the public dining area (the browser).

// The signIn function from "next-auth/react" is the Waiter 🤵.

// ==============================================================

// Your auth file

// This file is your server-side logic. It contains sensitive packages like bcrypt and your database connection code. This code must never be sent to the user's browser. The browser doesn't have a file system (fs) or the ability to connect to your database directly.

// ==============================================================

//The "next-auth/react" Package (The Waiter)
// This package provides your client-side toolkit. The signIn function it exports is a lightweight, browser-safe function. Its only job is to:

// Take the user's input (the "order": email and password).

// Make a secure network request (an API call) to your backend.

// It doesn't contain any of your secret logic. It just knows how to talk to the server.
