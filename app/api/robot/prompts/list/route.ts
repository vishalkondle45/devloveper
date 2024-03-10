import startDb from "@/lib/db";
import PromptModel from "@/models/Prompt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

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
    const prompts = await PromptModel.find({ user })
      .select("prompt")
      .sort("-createdAt");
    return NextResponse.json(prompts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
