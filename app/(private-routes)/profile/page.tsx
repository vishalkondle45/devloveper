"use client";
import Profile from "@/components/Profile";
import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const { data, status } = useSession();

  if (status === "loading") {
    return <LoadingOverlay visible={true} />;
  }
  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  return (
    <>
      <Profile />
    </>
  );
};

export default Page;
