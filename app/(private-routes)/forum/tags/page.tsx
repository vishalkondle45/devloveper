"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { getFormattedDateWithTime } from "@/lib/functions";
import {
  Badge,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { IconHash } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TagType {
  tag: string;
  count: number;
  lastAdded: string;
}
const Page = () => {
  const { status } = useSession();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Forum", href: "/forum" },
    { title: "Tags", href: "/tags" },
  ];

  const [tags, setTags] = useState<TagType[]>([]);

  const getTags = () => {
    axios.get("/api/forum/tags").then(({ data }) => {
      setTags(data);
    });
  };

  useEffect(() => {
    getTags();
  }, []);

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group my="md" justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Tags
        </Text>
      </Group>
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 3 }}
        spacing={{ base: 10, sm: "sm" }}
        verticalSpacing={{ base: "md", sm: "sm" }}
      >
        {tags.map((tag) => (
          <Paper p="md" radius="md" shadow="xs" withBorder>
            <Stack gap="xl">
              <Badge
                key={tag.tag}
                color="blue"
                tt="lowercase"
                variant="light"
                radius="xs"
                leftSection={<IconHash size={14} />}
              >
                {tag.tag}
              </Badge>
              <Group justify="space-between" wrap="nowrap">
                <Text size="sm" c="gray">
                  {tag.count} questions
                </Text>
                <Text size="sm" c="gray">
                  {getFormattedDateWithTime(tag.lastAdded)}
                </Text>
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Page;
