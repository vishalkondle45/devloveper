import startDb from "@/lib/db";
import GroupModel from "@/models/Group";
import PaidByModel from "@/models/PaidBy";
import SplitAmongModel from "@/models/SplitAmong";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }

  const user = session.user?._id;
  await startDb();

  const paids = await PaidByModel.find({ user })
    .populate({ path: "expense", select: ["description", "price"] })
    .populate({ path: "group", select: ["title", "type"] })
    .sort("-createdAt");

  const splits = await SplitAmongModel.find({ user })
    .populate({ path: "expense", select: ["description", "price"] })
    .populate({ path: "group", select: ["title", "type"] })
    .sort("-createdAt");

  const groups = await GroupModel.find({ users: user }).sort("-createdAt");

  return NextResponse.json(
    {
      lastFivePaids: paids.slice(0, 5),
      lastFiveSplits: splits.slice(0, 5),
      paidTotal: paids?.reduce((n, { amount }) => n + amount, 0).toFixed(2),
      splitTotal: splits?.reduce((n, { amount }) => n + amount, 0)?.toFixed(2),
      groups,
    },
    { status: 200 }
  );
};
