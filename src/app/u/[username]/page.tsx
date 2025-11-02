"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const params = useParams();
  const [content, setContent] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState("");

  const onSendMessage = async () => {
    try {
      const res = await axios.post("/api/send-message", {
        username: params.username,
        content: content ? content : selectedMessage,
      });

      toast.success(res.data.message);

      setContent("");
    } catch (error) {
      console.error("Error in u", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errroMessage = axiosError.response?.data.message;
      toast.error(errroMessage, {
        style: {
          background: "red",
        },
      });
    }
  };

  const onSuggestMessage = async () => {
    const res = await axios.post("/api/suggest-messages");
    const data = res.data.response.candidates[0].content.parts[0].text;
    const replaced = data.replace(/\|\|/g, "");
    const splitedAiQuestions = replaced.split("?");
    setAiMessages(splitedAiQuestions);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col gap-3 justify-center">
          <h1 className="text-center text-xl text-green-900 font-bold mt-6">
            Public Profile Link
          </h1>
          <div className="flex flex-col gap-1">
            <p>Send Anonymous Message to @{params.username}</p>
            <textarea
              className="rounded-lg border border-gray-400 p-3"
              placeholder="write your message...."
              name="content"
              onChange={(e) => setContent(e.target.value)}
              value={selectedMessage ? selectedMessage : content}
            ></textarea>
          </div>
          <button
            onClick={onSendMessage}
            className="cursor-pointer p-2 bg-blue-800 text-white rounded-sm w-fit self-center hover:bg-blue-950"
          >
            Send It
          </button>
        </div>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <button
              className="cursor-pointer p-2 bg-blue-800 text-white rounded-sm w-fit  hover:bg-blue-950"
              onClick={onSuggestMessage}
            >
              Suggest Messages
            </button>
            <p className="font-semibold text-lg">
              Click on any message below to select it.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="font-bold">Messages</h2>
            <div className="flex flex-col gap-3">
              {aiMessages.map((msg, index) => (
                <li key={index} className="list-none">
                  <input
                    value={`${msg}?`}
                    type="text"
                    className="w-full font-bold border border-gray-600 p-2"
                    readOnly
                    onClick={() => setSelectedMessage(`${msg}?`)}
                  />
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
