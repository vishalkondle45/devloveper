import startDb from "@/lib/db";
import ExpenseModel from "@/models/Expense";
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
  const expenses = await ExpenseModel.find({ group: params.group_id });
  if (!expenses) {
    return NextResponse.json(
      { message: "Please check the expenses id..." },
      { status: 401 }
    );
  }
  return NextResponse.json(expenses, { status: 200 });
};
