import startDb from "@/lib/db";
import NotificationModel from "@/models/Notification";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export const POST = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  await startDb();
  const isAlreadyNotified = await NotificationModel.findOne({
    user: body.user,
    message: body.message,
  });
  if (isAlreadyNotified) {
    return NextResponse.json(
      { error: "Already notification is present in user's notifications." },
      { status: 409 }
    );
  }
  const create = await NotificationModel.create(body);
  return NextResponse.json(create, { status: 201 });
};

export const GET = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const notifications = await NotificationModel.find({
    user: session.user?._id,
  });
  return NextResponse.json(notifications, { status: 200 });
};

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
  const notification = await NotificationModel.findByIdAndDelete(_id);
  return NextResponse.json(notification, { status: 200 });
};
