import startDb from "@/lib/db";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!", session, no: 1 },
      { status: 401 }
    );
  }
  await startDb();
  const user = await UserModel.findOne({ email: session?.user?.email }).select(
    "-password"
  );
  if (!user)
    return NextResponse.json(
      { error: "You are not authenticated!", session, no: 2 },
      { status: 401 }
    );

  return NextResponse.json(user, { status: 201 });
};

export const PUT = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!", session },
      { status: 401 }
    );
  }
  const body = await req.json();
  await startDb();
  const user = await UserModel.findOneAndUpdate(
    { email: session?.user?.email },
    body,
    { new: true }
  );
  return NextResponse.json(user, { status: 201 });
};
