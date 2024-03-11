"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { Container, Group, LoadingOverlay, Text, rem } from "@mantine/core";
import { useSession } from "next-auth/react";
const Page = () => {
  const { status } = useSession();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
  ];

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Live Matches
        </Text>
      </Group>
    </Container>
  );
};

export default Page;
