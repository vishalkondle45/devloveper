import startDb from "@/lib/db";
import TodoModel from "@/models/Todo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: NextRequest,
  { params }: { params: { list: string } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  let { list } = params;
  await startDb();
  const todos = await TodoModel.find({ user: session.user?._id, list });
  return NextResponse.json(todos, { status: 200 });
};
