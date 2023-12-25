"use client";
import NewNote from "@/components/Apps/Notes/NewNote";
import { Container, Group, LoadingOverlay, Text, rem } from "@mantine/core";
import { useSession } from "next-auth/react";

const Page = () => {
  const { status } = useSession();
  return (
    <Container>
      <LoadingOverlay visible={status === "loading"} />
      <Group justify="space-between" wrap="nowrap">
        <Text fz={rem(40)} fw={700}>
          Notes
        </Text>
        <NewNote />
      </Group>
    </Container>
  );
};

export default Page;
