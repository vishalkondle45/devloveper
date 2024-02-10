import startDb from "@/lib/db";
import FriendModel from "@/models/Friend";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import NotificationModel from "@/models/Notification";

// Get Friends and Requests
export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const friends = await FriendModel.find({
    $or: [{ sender: session?.user?._id }, { receiver: session?.user?._id }],
  })
    .populate({
      path: "sender",
      select: ["_id", "email", "name"],
    })
    .populate({
      path: "receiver",
      select: ["_id", "email", "name"],
    });
  return NextResponse.json(friends, { status: 200 });
};

// Send Request
export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  let { email } = body;
  await startDb();
  const receiver = await UserModel.findOne({ email });
  if (!receiver) {
    return NextResponse.json(
      { error: "Invalid email, Please check email address." },
      { status: 404 }
    );
  }
  if (receiver._id == session?.user?._id) {
    return NextResponse.json(
      { error: "You can't send friend request to yourself. :(" },
      { status: 409 }
    );
  }
  const isAlready = await FriendModel.findOne({
    $or: [
      { sender: receiver._id, receiver: session?.user?._id },
      { sender: session?.user?._id, receiver: receiver._id },
    ],
  });
  if (isAlready) {
    return NextResponse.json(
      {
        error: isAlready.isAccepted
          ? "Already friends..."
          : "Friend request is pending...",
      },
      { status: 409 }
    );
  }
  await FriendModel.create({
    sender: new mongoose.Types.ObjectId(session?.user?._id),
    receiver: new mongoose.Types.ObjectId(receiver._id),
  });
  const receiverUser = await UserModel.findById(receiver?._id);
  NotificationModel.create({
    user: receiver?._id,
    type: "split",
    link: "/split/friends",
    message: `${receiverUser?.name} sent you the friend request.`,
  });
  const friends = await FriendModel.find({
    $or: [{ sender: session?.user?._id }, { receiver: session?.user?._id }],
  })
    .populate({
      path: "sender",
      select: ["_id", "email", "name"],
    })
    .populate({
      path: "receiver",
      select: ["_id", "email", "name"],
    });
  return NextResponse.json(friends, { status: 200 });
};

// Accept or Reject Request
export const PUT = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const _id = req.nextUrl.searchParams.get("_id");
  const body = await req.json();
  await startDb();
  await FriendModel.findByIdAndUpdate(_id, body);
  const friend = await FriendModel.findById(_id);
  if (body?.isAccepted) {
    const sender = await UserModel.findById(friend?.sender);
    NotificationModel.create({
      user: friend?.sender,
      type: "split",
      link: "/split/friends",
      message: `${sender?.name} is accepted your friend request.`,
    });
  }
  const friends = await FriendModel.find({
    $or: [{ sender: session?.user?._id }, { receiver: session?.user?._id }],
  })
    .populate({
      path: "sender",
      select: ["_id", "email", "name"],
    })
    .populate({
      path: "receiver",
      select: ["_id", "email", "name"],
    });
  return NextResponse.json(friends, { status: 200 });
};

// Accept or Reject Request
export const DELETE = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const _id = req.nextUrl.searchParams.get("_id");
  await startDb();
  await FriendModel.findByIdAndDelete(_id);
  const friends = await FriendModel.find({
    $or: [{ sender: session?.user?._id }, { receiver: session?.user?._id }],
  })
    .populate({
      path: "sender",
      select: ["_id", "email", "name"],
    })
    .populate({
      path: "receiver",
      select: ["_id", "email", "name"],
    });
  return NextResponse.json(friends, { status: 200 });
};
