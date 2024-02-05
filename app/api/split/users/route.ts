import startDb from "@/lib/db";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: NextRequest,
  { params }: { params: { group_id: string } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  const _id = req.nextUrl.searchParams.get("_id");
  if (!session || !_id) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const users = await UserModel.findOne({ _id }).select("-password");
  return NextResponse.json(users, { status: 200 });
};
