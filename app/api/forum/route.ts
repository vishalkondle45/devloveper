import startDb from "@/lib/db";
import ForumModel from "@/models/Forum";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export const POST = async (req: Request): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  await startDb();
  const create = await ForumModel.create({
    ...body,
    user: new mongoose.Types.ObjectId(session?.user?._id),
  });
  return NextResponse.json(create, { status: 201 });
};

export const GET = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const page = req.nextUrl.searchParams.get("page") || 1;
  const forums = await ForumModel.find()
    .skip(10 * (Number(page) - 1))
    .limit(10)
    .sort("-createdAt")
    .populate({
      path: "user",
      select: ["name"],
    });
  const count = await ForumModel.countDocuments();
  return NextResponse.json({ forums, count }, { status: 200 });
};

export const PUT = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const _id = req.nextUrl.searchParams.get("_id");
  const body = await req.json();
  await startDb();
  const note = await ForumModel.findByIdAndUpdate(_id, body);
  return NextResponse.json(note, { status: 200 });
};

export const DELETE = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const _id = req.nextUrl.searchParams.get("_id");
  await startDb();
  const note = await ForumModel.findByIdAndDelete(_id);
  return NextResponse.json(note, { status: 200 });
};
