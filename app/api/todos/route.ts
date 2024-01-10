import startDb from "@/lib/db";
import TodoModel from "@/models/Todo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export const POST = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  await startDb();
  const create = await TodoModel.create({
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
  const todos = await TodoModel.find({ user: session.user?._id });
  return NextResponse.json(todos, { status: 200 });
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
  const todo = await TodoModel.findByIdAndUpdate(_id, body);
  return NextResponse.json(todo, { status: 200 });
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
  const todo = await TodoModel.findByIdAndDelete(_id);
  return NextResponse.json(todo, { status: 200 });
};
