import startDb from "@/lib/db";
import PromptModel from "@/models/Prompt";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: Request,
  { params }: { params: { prompt_id: Types.ObjectId } }
): Promise<any> => {
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
    const prompt = await PromptModel.findOne({ user, _id: params.prompt_id });
    return NextResponse.json(prompt, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
