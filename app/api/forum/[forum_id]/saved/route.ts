import startDb from "@/lib/db";
import SavedModel from "@/models/Saved";
import mongoose, { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: Request,
  { params }: { params: { forum_id: Types.ObjectId } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  let user = new mongoose.Types.ObjectId(session?.user?._id);
  let saved = await SavedModel.findOne({ user, forum: params?.forum_id });
  return NextResponse.json(Boolean(saved), { status: 200 });
};

export const POST = async (
  req: Request,
  { params }: { params: { forum_id: Types.ObjectId } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  let user = new mongoose.Types.ObjectId(session?.user?._id);
  let vote = await SavedModel.findOne({ user, forum: params.forum_id });
  if (vote) {
    await SavedModel.findOneAndDelete({ user, forum: params.forum_id });
  } else {
    await SavedModel.create({ user, forum: params.forum_id });
  }
  return NextResponse.json(null, { status: 201 });
};
