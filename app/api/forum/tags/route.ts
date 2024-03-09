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
  const forums = await ForumModel.aggregate()
    .unwind("$tags")
    .group({
      _id: "$tags",
      count: { $sum: 1 },
      lastAdded: { $max: "$updatedAt" },
    })
    .project({ tag: "$_id", count: 1, lastAdded: 1, _id: 0 })
    .skip(0)
    .limit(10)
    .sort({ lastAdded: -1 });
  return NextResponse.json(forums, { status: 200 });
};
