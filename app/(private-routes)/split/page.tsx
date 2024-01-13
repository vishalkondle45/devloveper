"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { Container, LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";

const Page = () => {
  const { status } = useSession();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Split", href: "/split" },
  ];

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container mt="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
    </Container>
  );
};

export default Page;
