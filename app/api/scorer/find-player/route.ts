import startDb from "@/lib/db";
import PlayerModel from "@/models/Player";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const GET = async (req: NextRequest): Promise<any> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { error: "Please provide email" },
        { status: 400 }
      );
    }
    await startDb();
    const user = await UserModel.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Email not registered" },
        { status: 404 }
      );
    const player = await PlayerModel.findOne({ user: user._id }).populate(
      "user"
    );
    if (!player) {
      return NextResponse.json(
        { error: "Player does not exists with this email" },
        { status: 409 }
      );
    }
    return NextResponse.json(player, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
