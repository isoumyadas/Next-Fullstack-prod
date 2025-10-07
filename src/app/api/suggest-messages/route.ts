import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  await dbConnect();

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  //   const { content } = await req.json();

  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 300,
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });

    if (!response) {
      return Response.json(
        {
          success: false,
          message: "Failed to get response from AI",
        },
        { status: 400 }
      );
    }

    // console.log(
    //   response.candidates?.map((con) => {
    //     console.log(con.content?.parts);
    //     console.log(con.tokenCount);
    //   })
    // );
    // console.log("response Data: ", response.data);
    // console.log("response meta data: ", response.usageMetadata);
    // console.log("response prompt feedback: ", response.promptFeedback);
    // console.log("response exe code: ", response.executableCode);

    return Response.json(
      {
        success: true,
        response: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get messages form Gemini AI", error);

    return Response.json(
      {
        success: false,
        message: "Failed to get suggest messages",
      },
      { status: 500 }
    );
  }
}
