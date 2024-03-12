import startDb from "@/lib/db";
import TeamModel from "@/models/Team";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: NextRequest,
  { params }: { params: { _id: Types.ObjectId } }
): Promise<any> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    await startDb();
    const team = await TeamModel.findOne({
      _id: params._id,
      // players: session.user?._id,
      // $or: [{ user: session.user?._id }, , { players: session.user?._id }],
    })
      .populate({
        path: "players",
        populate: {
          path: "user",
          model: "User",
          select: "name",
        },
      })
      .populate("user");
    if (!team) {
      return NextResponse.json(
        {
          error: "Team not found",
          _id: params._id,
          players: session.user?._id,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { _id: Types.ObjectId } }
): Promise<any> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    await startDb();
    const { _id, ...body } = await req.json();
    // :TODO Need to check access
    const find = await TeamModel.findOne({ _id: params._id });
    if (!find) {
      return NextResponse.json({ error: "Team not found" }, { status: 409 });
    }
    const user = await TeamModel.findByIdAndUpdate(params._id, body);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
