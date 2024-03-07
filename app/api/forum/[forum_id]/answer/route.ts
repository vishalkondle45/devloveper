import startDb from "@/lib/db";
import AnswerModel from "@/models/Answer";
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
  let answers = await AnswerModel.find({ forum: params?.forum_id })
    .populate({
      path: "user",
      select: ["name"],
    })
    .sort("-votes");
  return NextResponse.json(answers, { status: 200 });
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
  const body = await req.json();
  await startDb();
  let user = new mongoose.Types.ObjectId(session?.user?._id);
  await AnswerModel.create({ ...body, user, forum: params.forum_id });
  return NextResponse.json(null, { status: 201 });
};

export const PUT = async (
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
  const body = await req.json();
  await startDb();
  let user = new mongoose.Types.ObjectId(session?.user?._id);
  await AnswerModel.findOneAndUpdate({ user, _id: body?.answer }, body);
  return NextResponse.json(null, { status: 201 });
};
