import startDb from "@/lib/db";
import GroupModel from "@/models/Group";
import NotificationModel from "@/models/Notification";
import PaidByModel from "@/models/PaidBy";
import SplitAmongModel from "@/models/SplitAmong";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: NextRequest,
  { params }: { params: { group_id: string } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const group = await GroupModel.findById(params.group_id);
  if (!group?.users) {
    return 0;
  }

  const users = await UserModel.find({
    $and: [
      {
        _id: {
          $nin: [
            ...group?.users,
            new mongoose.Types.ObjectId(session.user?._id),
          ],
        },
      },
    ],
  }).select("name _id email");
  return NextResponse.json(users, { status: 200 });
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { group_id: string } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  const { user } = await req.json();
  if (!session || !user) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();

  let group = await GroupModel.findById(params.group_id);
  let found = group?.users.find(({ _id }) => String(_id) === user);
  let newUsers = group?.users ? [...group?.users] : [];
  if (found) {
    const paidBy = await PaidByModel.find({
      group: params.group_id,
      user,
    });
    const splitAmong = await SplitAmongModel.find({
      group: params.group_id,
      user,
    });

    const paidTotal = paidBy.reduce((a, { amount }) => a + amount, 0);
    const splitTotal = splitAmong.reduce((a, { amount }) => a + amount, 0);

    console.log({ paidBy, paidTotal, splitAmong, splitTotal });

    if (Math.round(paidTotal) !== Math.round(splitTotal)) {
      // console.log({ paidTotal, splitTotal });
      return NextResponse.json(
        { error: "Please settle amount, to remove this user" },
        { status: 409 }
      );
    }
    newUsers = newUsers.filter(({ _id }) => String(_id) !== user);
  } else {
    newUsers = [...newUsers, new mongoose.Types.ObjectId(user)];
  }
  const users = await GroupModel.findOneAndUpdate(
    { _id: params.group_id },
    { users: newUsers }
  );
  if (!found) {
    const admin = await UserModel.findById(group?.user);
    await NotificationModel.create({
      user: user,
      message: `<b>${admin?.name}</b> added you in <b>${group?.title}</b>`,
      type: "split",
      link: `/split/groups/${group?._id}`,
    });
  }
  return NextResponse.json(users, { status: 200 });
};
