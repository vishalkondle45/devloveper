import startDb from "@/lib/db";
import GroupModel from "@/models/Group";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  let groups = await GroupModel.find({ user: session.user?._id });
  return NextResponse.json(groups, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  await startDb();
  let group = await GroupModel.create({ ...body, user: session.user?._id });
  return NextResponse.json(group, { status: 200 });
};
