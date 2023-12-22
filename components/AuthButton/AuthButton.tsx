"use client";
import { Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoggedIn from "../auth/LoggedIn";

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
          <LoggedIn data={data} />
        </>
      ) : (
        <Button
          size="xs"
          variant="filled"
          onClick={() => router.push("/auth/login")}
        >
          Login
        </Button>
      )}
    </>
  );
};

export default AuthButton;
