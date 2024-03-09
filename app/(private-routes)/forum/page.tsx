"use client";
import { ForumTypes } from "@/components/Forum/Forum.Types";
import ForumItem from "@/components/Forum/ForumItem";
import NewForum from "@/components/Forum/NewForum/NewForum";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Container,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Forum", href: "/forum" },
  ];

  const [forums, setForums] = useState<ForumTypes>([]);

  const getForums = () => {
    axios.get("/api/forum/top-questions").then(({ data }) => {
      setForums(data);
    });
  };

  useEffect(() => {
    getForums();
  }, []);

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group my="md" justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Top Questions
        </Text>
        <NewForum getForums={getForums} />
      </Group>
      <Stack>
        {forums.map((forum) => (
          <ForumItem forum={forum} />
        ))}
      </Stack>
    </Container>
  );
};

export default Page;
