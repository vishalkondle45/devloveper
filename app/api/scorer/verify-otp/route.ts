import startDb from "@/lib/db";
import UserModel from "@/models/User";
import VerificationModel from "@/models/Verification";
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
    const { _id, pin } = await req.json();
    if (!pin) {
      return NextResponse.json(
        { error: "Please provide email" },
        { status: 400 }
      );
    }
    await startDb();
    const verification = await VerificationModel.findOne({ _id });
    if (!verification) {
      return NextResponse.json({ error: "Invalid request" }, { status: 401 });
    }
    if (verification?.pin !== Number(pin)) {
      if (verification.chance >= 3) {
        await VerificationModel.findOneAndDelete({ _id });
        return NextResponse.json(
          { error: "OTP Expired, please regenerate." },
          { status: 409 }
        );
      }
      await VerificationModel.findOneAndUpdate(
        { _id },
        { chance: verification.chance + 1 }
      );
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }
    const user = await UserModel.findById(verification.user).select("_id name");
    if (!user) {
      return NextResponse.json(
        { error: "You are not authenticated!" },
        { status: 401 }
      );
    }
    await VerificationModel.deleteMany({ user: verification.user });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
