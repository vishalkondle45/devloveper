import startDb from "@/lib/db";
import AnswerModel from "@/models/Answer";
import DownVoteModel from "@/models/DownVote";
import ForumModel from "@/models/Forum";
import UpVoteModel from "@/models/UpVote";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const PUT = async (req: Request): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const body = await req.json();
  let user = new mongoose.Types.ObjectId(session?.user?._id);
  let vote = await DownVoteModel.findOne({ user, forum: body?._id });
  if (vote) {
    return NextResponse.json(
      { error: "You are already downvoted." },
      { status: 400 }
    );
  }
  vote = await UpVoteModel.findOne({ user, forum: body?._id });
  const answer = await AnswerModel.findById(body?._id);
  const question = await ForumModel.findById(body?._id);
  if (vote) {
    await UpVoteModel.findOneAndDelete({ user, forum: body?._id });
  } else {
    await DownVoteModel.create({ user, forum: body?._id });
  }
  if (Boolean(answer)) {
    await AnswerModel.findByIdAndUpdate(body?._id, {
      votes: (answer?.votes || 0) - 1,
    });
  }
  if (Boolean(question)) {
    await ForumModel.findByIdAndUpdate(body?._id, {
      votes: (question?.votes || 0) - 1,
    });
  }
  return NextResponse.json(null, { status: 201 });
};
