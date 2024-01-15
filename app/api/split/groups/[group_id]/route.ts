import startDb from "@/lib/db";
import GroupModel from "@/models/Group";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

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
  let { group_id } = params;
  await startDb();
  const group = await GroupModel.findOne({
    _id: group_id,
    $or: [{ user: session.user?._id }, { users: session.user?._id }],
  }).populate({
    path: "users",
    select: ["_id", "email", "name"],
  });
  if (!group) {
    return NextResponse.json(
      { message: "Please check the group id..." },
      { status: 401 }
    );
  }
  return NextResponse.json(group, { status: 200 });
};
