import startDb from "@/lib/db";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: NextRequest,
  { params }: { params: { group_id: string } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const query = req.nextUrl.searchParams.get("query")?.toLowerCase().trim();
  if (!query || query.length < 4) {
    return NextResponse.json([], { status: 200 });
  }
  await startDb();
  const users = await UserModel.find({
    $or: [
      { email: { $regex: ".*" + query + ".*" } },
      { name: { $regex: ".*" + query + ".*" } },
    ],
  }).select("name _id email");
  return NextResponse.json(users, { status: 200 });
};
