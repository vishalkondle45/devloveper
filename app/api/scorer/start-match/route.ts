import startDb from "@/lib/db";
import InningModel from "@/models/Inning";
import MatchModel from "@/models/Match";
import SquadModel from "@/models/Squad";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const POST = async (req: NextRequest): Promise<any> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    await startDb();
    const body = await req.json();
    const match = await MatchModel.create({
      ...body.match,
      user: session?.user?._id,
    });
    const home = await SquadModel.create({
      ...body.home,
      match: match._id,
      team: body.match.home,
    });
    const away = await SquadModel.create({
      ...body.away,
      match: match._id,
      team: body.match.away,
    });
    const batting =
      body.inning.batting === body.match.away ? away._id : home._id;
    const bowling =
      body.inning.batting === body.match.away ? home._id : away._id;
    await InningModel.create({
      ...body.inning,
      match: match._id,
      batting,
      bowling,
    });
    return NextResponse.json(match, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
