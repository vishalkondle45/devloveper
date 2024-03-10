import { geminiModelConfig } from "@/lib/constants";
import startDb from "@/lib/db";
import PromptModel from "@/models/Prompt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

const genAI = new GoogleGenerativeAI("AIzaSyAX_g2tt62jLFGKyHZm-SPnkDUvV3oqUNk");

export const POST = async (req: Request): Promise<any> => {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    await startDb();
    const model = genAI.getGenerativeModel(geminiModelConfig);
    const body = await req.json();
    const prompt = body.prompt;
    const result = await model.generateContent(body.prompt);
    const response = result.response.text();
    const newPrompt = await PromptModel.create({ user, prompt, response });
    return NextResponse.json(newPrompt, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request): Promise<any> => {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    await startDb();
    const prompts = await PromptModel.find({ user }).sort("-createdAt");
    return NextResponse.json(prompts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
