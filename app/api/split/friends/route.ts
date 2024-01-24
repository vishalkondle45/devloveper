import startDb from "@/lib/db";
import UserModel from "@/models/User";
import mongoose from "mongoose";
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
  const me = await UserModel.findOne({ _id: session.user?._id });
  const user = await UserModel.find({ _id: { $in: me?.friends } });
  return NextResponse.json(user, { status: 200 });
};

export const PUT = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  let friend = body.friend;
  await startDb();
  let user = await UserModel.findOne({ _id: session.user?._id });
  let friends: any = user?.friends;
  if (friends.find((item: any) => String(item) === String(friend))) {
    friends = friends.filter((item: any) => String(item) !== String(friend));
  } else {
    friends = [...friends, new mongoose.Types.ObjectId(friend)];
  }
  user = await UserModel.findOneAndUpdate(
    { _id: session.user?._id },
    { friends: friends }
  );
  return NextResponse.json(user, { status: 200 });
};
