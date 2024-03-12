import startDb from "@/lib/db";
import TeamModel from "@/models/Team";
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
    const find = await TeamModel.findOne({ name: body.name });
    if (find) {
      return NextResponse.json(
        { error: "Team name already taken" },
        { status: 409 }
      );
    }
    const user = await TeamModel.create({
      ...body,
      creator: session?.user?._id,
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
