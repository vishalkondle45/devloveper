import startDb from "@/lib/db";
import LabelModel from "@/models/Label";
import NoteModel from "@/models/Note";
import mongoose, { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../auth/[...nextauth]/authOptions";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { _id: Types.ObjectId; id: Types.ObjectId } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const label = await LabelModel.findById(params.id);
  if (!label?.user || String(label?.user) !== String(session.user?._id)) {
    return NextResponse.json(
      {
        error: "Access denied!",
        label,
        session,
        search: req.nextUrl.searchParams,
      },
      { status: 401 }
    );
  }
  const note = await NoteModel.findById(params._id);
  let labels: Types.ObjectId[] = [];
  if (
    params.id &&
    note?.labels.find((label) => String(label) === String(params.id))
  ) {
    labels = note.labels.filter((item) => String(item) !== String(params.id));
  } else {
    if (params.id && note) {
      labels = [...note.labels, new mongoose.Types.ObjectId(params.id)];
    }
  }
  let updated = await NoteModel.findByIdAndUpdate(
    params._id,
    { labels },
    { new: true }
  );
  return NextResponse.json(updated, { status: 200 });
};
