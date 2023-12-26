import startDb from "@/lib/db";
import NoteModel from "@/models/Note";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async (
  request: Request,
  { params }: { params: { _id: Types.ObjectId } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const note = await NoteModel.findById(params._id);
  return NextResponse.json(note, { status: 200 });
};
