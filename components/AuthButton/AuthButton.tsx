"use client";
import { Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoggedIn from "../auth/LoggedIn";
import { Session } from "next-auth";

const AuthButton = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const isAuth = status === "authenticated";

  if (status === "loading") {
    return <></>;
  }

  return (
    <>
      {isAuth ? (
        <>
          <LoggedIn data={data as Session} />
        </>
      ) : (
        <Button onClick={() => router.push("/auth/login")}>Login</Button>
      )}
    </>
  );
};

export default AuthButton;
