import startDb from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import PaidByModel from "@/models/PaidBy";
import SplitAmongModel from "@/models/SplitAmong";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../auth/[...nextauth]/authOptions";
import { Types } from "./Expense.Types";

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
  const expenses = await ExpenseModel.find({
    group: params.group_id,
  });
  if (!expenses) {
    return NextResponse.json(
      { message: "Please check the expenses id..." },
      { status: 401 }
    );
  }
  const paidBy = await PaidByModel.find({
    group: params.group_id,
  });
  const splitAmong = await SplitAmongModel.find({
    group: params.group_id,
  });
  return NextResponse.json({ expenses, paidBy, splitAmong }, { status: 200 });
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { group_id: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  const group = new mongoose.Types.ObjectId(params.group_id);
  const paidBy = body.paidBy.filter((item: Types) => item.amount > 0);
  const splitAmong = body.splitAmong.filter((item: Types) => item.amount > 0);
  await startDb();
  let object = {
    description: body.description,
    category: body.category,
    price: body.price,
    date: new Date(body.date),
    user: new mongoose.Types.ObjectId(session.user?._id),
    group,
  };
  let expense = await ExpenseModel.create(object);
  await PaidByModel.insertMany(
    paidBy.map(({ amount, user }: Types) => ({
      expense,
      group,
      amount,
      user: new mongoose.Types.ObjectId(user),
    }))
  );
  await SplitAmongModel.insertMany(
    splitAmong.map(({ amount, user }: Types) => ({
      expense,
      group,
      amount,
      user: new mongoose.Types.ObjectId(user),
    }))
  );
  let expenses = await ExpenseModel.find();
  return NextResponse.json(expenses, { status: 200 });
};

export const DELETE = async (req: NextRequest): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const expense = req.nextUrl.searchParams.get("_id");
  await startDb();
  await ExpenseModel.findByIdAndDelete(expense);
  await PaidByModel.deleteMany({ expense });
  await SplitAmongModel.deleteMany({ expense });
  const expenses = await ExpenseModel.find();
  return NextResponse.json(expenses, { status: 200 });
};
