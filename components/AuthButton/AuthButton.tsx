"use client";
import { Button, Loader, Text } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const AuthButton = () => {
  const { status } = useSession();
  const router = useRouter();
  const isAuth = status === "authenticated";
  const handleClick = () => {
    if (isAuth) {
      signOut();
    } else {
      router.push("/auth/login");
    }
  };

  if (status === "loading") {
    return <></>;
  }

  return (
    <>
      <Button size="xs" variant="filled" onClick={handleClick}>
        {isAuth ? "Logout" : "Login"}
      </Button>
    </>
  );
};

export default AuthButton;
