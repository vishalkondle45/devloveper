import startDb from "@/lib/db";
import TodoModel from "@/models/Todo";
import TodoListModel from "@/models/TodoList";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const POST = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const create = await TodoListModel.create({
    title: "Untitled list",
    user: new mongoose.Types.ObjectId(session?.user?._id),
  });
  return NextResponse.json(create._id, { status: 201 });
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
  const lists = await TodoListModel.find({ user: session.user?._id }).sort(
    "-createdAt"
  );
  return NextResponse.json(lists, { status: 200 });
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
  const list = await TodoListModel.findByIdAndUpdate(_id, body);
  return NextResponse.json(list, { status: 200 });
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
  const list = await TodoListModel.findByIdAndDelete(_id);
  const todos = await TodoModel.deleteMany({ list: _id });
  return NextResponse.json({ list, todos }, { status: 200 });
};
