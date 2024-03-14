"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { Container, Group, LoadingOverlay, Text, rem } from "@mantine/core";
import { useSession } from "next-auth/react";
const Page = () => {
  const { status } = useSession();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Match", href: "/scorer/match" },
    { title: "Match_ID", href: "/scorer/match/id" },
  ];

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Team vs Team
        </Text>
      </Group>
    </Container>
  );
};

export default Page;
