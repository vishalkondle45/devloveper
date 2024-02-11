import startDb from "@/lib/db";
import PaidByModel from "@/models/PaidBy";
import SplitAmongModel from "@/models/SplitAmong";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import GroupModel from "@/models/Group";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const paidTotal = await PaidByModel.find({
    user: session.user?._id,
  });
  const splitTotal = await SplitAmongModel.find({
    user: session.user?._id,
  });
  const groups = await GroupModel.find({
    users: session.user?._id,
  }).sort("-createdAt");
  return NextResponse.json(
    {
      paidTotal: paidTotal?.reduce((n, { amount }) => n + amount, 0).toFixed(2),
      splitTotal: splitTotal
        ?.reduce((n, { amount }) => n + amount, 0)
        ?.toFixed(2),
      groups,
    },
    { status: 200 }
  );
};
