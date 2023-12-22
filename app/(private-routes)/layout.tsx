import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode;
}
export default async function RootLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");
  return <>{children}</>;
}
