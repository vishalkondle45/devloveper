"use client";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  router.push("/scorer/teams");
  return <LoadingOverlay visible />;
};

export default Page;
