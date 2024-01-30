import startDb from "@/lib/db";
import GroupModel from "@/models/Group";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  let groups = await GroupModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        "user.password": 0,
        "user.verificationCode": 0,
        "user.isAdmin": 0,
        "user.isVerified": 0,
        "user.friends": 0,
        "user.createdAt": 0,
        "user.updatedAt": 0,
        "user.__v": 0,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $project: {
        "users.password": 0,
        "users.verificationCode": 0,
        "users.isAdmin": 0,
        "users.isVerified": 0,
        "users.friends": 0,
        "users.createdAt": 0,
        "users.updatedAt": 0,
        "users.__v": 0,
      },
    },
  ]);
  return NextResponse.json(groups, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  await startDb();
  let group = await GroupModel.create({
    ...body,
    users: [...body.users, session?.user?._id],
    user: session.user?._id,
  });
  return NextResponse.json(group, { status: 200 });
};
