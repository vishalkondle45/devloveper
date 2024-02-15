import startDb from "@/lib/db";
import DownVoteModel from "@/models/DownVote";
import UpVoteModel from "@/models/UpVote";
import mongoose, { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

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
  let vote = await DownVoteModel.findOne({ user, forum: params.forum_id });
  if (vote) {
    return NextResponse.json(
      { error: "You are already down voted." },
      { status: 400 }
    );
  }
  vote = await UpVoteModel.findOne({ user, forum: params.forum_id });
  if (vote) {
    await UpVoteModel.findOneAndDelete({ user, forum: params.forum_id });
  } else {
    await DownVoteModel.create({ user, forum: params.forum_id });
  }
  return NextResponse.json(null, { status: 201 });
};
