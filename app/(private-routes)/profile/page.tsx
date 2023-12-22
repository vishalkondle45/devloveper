"use client";
import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const { data, status } = useSession();

  if (status === "loading") {
    return <LoadingOverlay />;
  }
  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  return <div>{data?.user?.email}</div>;
};

export default Page;
