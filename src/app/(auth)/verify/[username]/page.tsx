"use client";

import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Verify() {
  const router = useRouter();
  const params = useParams();
  const [code, setCode] = useState("");

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onVerifySubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log("code?????? => ", data.code);
    try {
      const res = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        verifyCode: data.code,
      });
      toast.success(res.data.message);

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errroMessage = axiosError.response?.data.message;
      toast.error(errroMessage, {
        style: {
          background: "red",
        },
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onVerifySubmit)}
            className="space-y-6"
          >
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  {/* <FormControl> */}
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {/* </FormControl> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full cursor-pointer" type="submit">
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
