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
  const forums = await ForumModel.find({ saved: { $in: session.user?._id } })
    .sort("-createdAt")
    .populate({
      path: "user",
      select: ["name"],
    });
  const count = await ForumModel.countDocuments();
  return NextResponse.json({ forums, count }, { status: 200 });
};
