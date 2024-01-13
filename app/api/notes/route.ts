import startDb from "@/lib/db";
import NoteModel from "@/models/Note";
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
  const create = await NoteModel.create({
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
  const notes = await NoteModel.find({
    user: session.user?._id,
    $and: [
      { trashed: req.nextUrl.searchParams.get("trashed") !== null },
      Boolean(req.nextUrl.searchParams.get("label"))
        ? {
            labels: req.nextUrl.searchParams.get("label") || undefined,
          }
        : {},
    ],
  }).sort("-createdAt");
  return NextResponse.json(notes, { status: 200 });
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
  const note = await NoteModel.findByIdAndUpdate(_id, body);
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
  const note = await NoteModel.findByIdAndDelete(_id);
  return NextResponse.json(note, { status: 200 });
};
