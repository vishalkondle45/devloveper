import startDb from "@/lib/db";
import ForumModel from "@/models/Forum";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: NextRequest,
  { params }: { params: { tag: string } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const forums = await ForumModel.findOne({ tags: params.tag }).populate({
    path: "user",
    select: ["_id", "email", "name"],
  });
  return NextResponse.json(forums, { status: 200 });
};
