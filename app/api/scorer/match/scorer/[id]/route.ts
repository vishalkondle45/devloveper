import startDb from "@/lib/db";
import InningModel from "@/models/Inning";
import MatchModel from "@/models/Match";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../auth/[...nextauth]/authOptions";

export const GET = async (req: NextRequest, { params }: any): Promise<any> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    await startDb();
    const match = await MatchModel.findOne({ _id: params.id })
      .populate({ path: "home", select: ["-players"] })
      .populate({ path: "away", select: ["-players"] })
      .populate({ path: "user", select: ["name"] });
    const innings = await InningModel.find({ match: params.id })
      .populate("match")
      .populate({
        path: "batting",
        populate: {
          path: "squad",
          populate: { path: "user", select: ["name"] },
        },
      })
      .populate({
        path: "bowling",
        populate: {
          path: "squad",
          populate: { path: "user", select: ["name"] },
        },
      })
      .populate("striker")
      .populate("nonStriker")
      .populate("bowler");
    return NextResponse.json({ match, innings }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
