import startDb from "@/lib/db";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";
import Chance from "chance";
import { sendMail } from "@/lib/sendMail";
import { NewResponse, NewUserRequest } from "./users.types";
const chance = new Chance();

export const POST = async (req: Request): Promise<NewResponse> => {
  const body = (await req.json()) as NewUserRequest;

  // connect to db
  await startDb();

  // check is email already registered
  const oldUser = await UserModel.findOne({ email: body.email });
  if (oldUser)
    return NextResponse.json(
      { error: "Email is already in use!" },
      { status: 409 }
    );

  // generate verification code
  let verificationCode = chance.guid();

  // create user
  const user = await UserModel.create({ ...body, verificationCode });

  // send verification link
  const mailData = {
    to: body.email,
    subject: "Verification link",
    html: `Please verify your account - <a href='http://localhost:3000/verify?code=${verificationCode}'>Verify</a>`,
  };
  sendMail(mailData);
  return NextResponse.json(
    {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    },
    { status: 201 }
  );
};
