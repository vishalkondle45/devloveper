import { NextResponse } from "next/server";

export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface NewUserResponse {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export type NewResponse = NextResponse<{
  user?: NewUserResponse;
  error?: string;
}>;
