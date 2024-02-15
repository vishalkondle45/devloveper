import startDb from "@/lib/db";
import ForumModel from "@/models/Forum";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const GET = async (
  req: Request,
  { params }: { params: { forum_id: Types.ObjectId } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  const forums = await ForumModel.findById(params.forum_id).populate({
    path: "user",
    select: ["name"],
  });
  return NextResponse.json(forums, { status: 200 });
};

export const PUT = async (
  req: Request,
  { params }: { params: { forum_id: Types.ObjectId } }
): Promise<any> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  const body = await req.json();
  await startDb();
  const note = await ForumModel.findByIdAndUpdate(params.forum_id, body);
  return NextResponse.json(note, { status: 200 });
};

// export const DELETE = async (req: NextRequest): Promise<any> => {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json(
//       { error: "You are not authenticated!" },
//       { status: 401 }
//     );
//   }
//   const _id = req.nextUrl.searchParams.get("_id");
//   await startDb();
//   const note = await ForumModel.findByIdAndDelete(_id);
//   return NextResponse.json(note, { status: 200 });
// };
