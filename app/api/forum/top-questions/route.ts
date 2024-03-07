import startDb from "@/lib/db";
import ForumModel from "@/models/Forum";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const GET = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const forums = await ForumModel.find()
    .sort("-votes")
    .populate({
      path: "user",
      select: ["name"],
    });
  return NextResponse.json(forums, { status: 200 });
};
