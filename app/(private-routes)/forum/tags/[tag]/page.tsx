"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { colors } from "@/lib/constants";
import {
  getDigitByString,
  getFormattedDateWithTime,
  getInitials,
  timeFromNow,
} from "@/lib/functions";
import {
  Avatar,
  Badge,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import {
  IconEye,
  IconHeartFilled,
  IconMessageCircle2,
} from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TagType {
  _id: string;
  question: string;
  description: string;
  user: User;
  tags: string[];
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  views: Types.ObjectId[];
  saved: Types.ObjectId[];
  answers: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
}

const Page = () => {
  const { status } = useSession();
  const params = useParams();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Forum", href: "/forum" },
    { title: "Tags", href: "/tags" },
    { title: `#${String(params.tag)}`, href: `/tags/${String(params.tag)}` },
  ];

  const [tag, setTag] = useState<TagType>();
  const router = useRouter();

  const getTag = () => {
    axios.get(`/api/forum/tags/${params?.tag}`).then(({ data }) => {
      setTag(data);
    });
  };

  useEffect(() => {
    getTag();
  }, []);

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group my="md" justify="space-between">
        <Text fz={rem(40)} fw={700}>
          {String(params.tag)}
        </Text>
      </Group>
      <Paper
        shadow="xl"
        p="sm"
        onClick={() => router.push(`/forum/${tag?._id}`)}
        withBorder
      >
        <Group wrap="nowrap" align="baseline">
          <Stack gap="xs">
            <Badge
              size="lg"
              variant="light"
              color="red"
              leftSection={<IconHeartFilled width={16} />}
            >
              {Number(tag?.upvotes?.length) - Number(tag?.downvotes?.length)}
            </Badge>
            <Badge size="lg" leftSection={<IconMessageCircle2 width={16} />}>
              {tag?.answers}
            </Badge>
            <Badge
              size="lg"
              variant="light"
              color="gray"
              leftSection={<IconEye width={16} />}
            >
              {tag?.views?.length}
            </Badge>
          </Stack>
          <Stack gap="xs">
            {tag?.question && (
              <Text
                fw={500}
                dangerouslySetInnerHTML={{ __html: tag?.question }}
              />
            )}
            <Group gap="xs" justify="flex-start">
              {tag?.tags?.map((tag: string) => (
                <Badge
                  key={tag}
                  color={colors[getDigitByString(tag)]}
                  tt="lowercase"
                  variant="light"
                  radius="xs"
                >
                  {tag}
                </Badge>
              ))}
            </Group>
          </Stack>
        </Group>
        <Group gap={rem(4)} justify="right">
          <Avatar
            size="xs"
            color={colors[getDigitByString(tag?.user?.name)]}
            title={tag?.user?.name}
          >
            {getInitials(tag?.user?.name)}
          </Avatar>
          <Text fz="xs" fw={700}>
            {tag?.user?.name}
          </Text>
          <Text fz="xs" title={getFormattedDateWithTime(tag?.createdAt)}>
            asked {tag?.createdAt && timeFromNow(tag?.createdAt)}
          </Text>
        </Group>
      </Paper>
    </Container>
  );
};

export default Page;
