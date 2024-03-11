import startDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import PlayerModel from "@/models/Player";
import UserModel from "@/models/User";
import VerificationModel from "@/models/Verification";
import { Chance } from "chance";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

const chance = new Chance();

export const POST = async (req: NextRequest): Promise<any> => {
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
    const player = await PlayerModel.findOne({ user: user._id });
    if (player) {
      return NextResponse.json(
        { error: "Player already exists with this email" },
        { status: 409 }
      );
    }
    const pin = chance.integer({ min: 1000, max: 9999 });
    await VerificationModel.deleteMany({ user: user._id });
    const verification = await VerificationModel.create({
      user: user._id,
      pin,
    });
    const mailData = {
      to: email,
      subject: "Pin for regestration in Scorer",
      html: `Your secured pin for scorer registration - ${pin}`,
    };
    sendMail(mailData);
    return NextResponse.json(verification._id, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
