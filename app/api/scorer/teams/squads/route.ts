import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import PlayerModel from "@/models/Player";
import TeamModel from "@/models/Team";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (): Promise<any> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    await startDb();
    const player = await PlayerModel.findOne({ user: session.user?._id });
    const teams = await TeamModel.find({ players: player?._id })
      .populate({
        path: "captain",
        populate: {
          path: "user",
          model: "User",
          select: "name",
        },
      })
      .populate({
        path: "players",
        populate: {
          path: "user",
          model: "User",
          select: "name",
        },
      });
    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
