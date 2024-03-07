"use client";
import { ForumTypes } from "@/components/Forum/Forum.Types";
import NewForum from "@/components/Forum/NewForum/NewForum";
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
  Center,
  Container,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Pagination,
  Paper,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import {
  IconEye,
  IconHeartFilled,
  IconMessageCircle2,
} from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Forum", href: "/forum" },
  ];

  const [forums, setForums] = useState<ForumTypes>([]);

  // Pagination
  const [total, setTotal] = useState(0);
  const [page, onChange] = useState(1);

  const getForums = () => {
    axios.get(`/api/forum?page=${page}`).then(({ data }) => {
      setForums(data.forums);
      setTotal(data.count);
    });
  };

  useEffect(() => {
    getForums();
  }, [page]);

  const router = useRouter();

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group my="md" justify="space-between">
        <Text fz={rem(40)} fw={700}>
          All Questions
        </Text>
        <NewForum getForums={getForums} />
      </Group>
      <Text fz="lg" mb="xs" fw={500}>
        <NumberFormatter
          value={total}
          thousandsGroupStyle="lakh"
          thousandSeparator=","
          decimalSeparator="."
          decimalScale={2}
        />{" "}
        questions
      </Text>
      <Stack>
        {forums.map((forum) => (
          <Paper
            shadow="xl"
            p="sm"
            onClick={() => router.push(`forum/${forum?._id}`)}
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
                  {forum?.votes}
                </Badge>
                <Badge
                  size="lg"
                  leftSection={<IconMessageCircle2 width={16} />}
                >
                  {forum?.answers}
                </Badge>
                <Badge
                  size="lg"
                  variant="light"
                  color="gray"
                  leftSection={<IconEye width={16} />}
                >
                  {forum?.views}
                </Badge>
              </Stack>
              <Stack gap="xs">
                <Text
                  fw={500}
                  dangerouslySetInnerHTML={{ __html: forum?.question }}
                />
                <Group gap="xs" justify="flex-start">
                  {forum?.tags?.map((tag: string) => (
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
                color={colors[getDigitByString(forum.user?.name)]}
                title={forum.user?.name}
              >
                {getInitials(forum.user?.name)}
              </Avatar>
              <Text fz="xs" fw={700}>
                {forum.user?.name}
              </Text>
              <Text fz="xs" title={getFormattedDateWithTime(forum?.createdAt)}>
                asked {timeFromNow(forum?.createdAt)}
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>
      <Center mt="xl">
        <Pagination
          size="md"
          value={page}
          onChange={onChange}
          total={Math.ceil(total / 10)}
        />
      </Center>
    </Container>
  );
};

export default Page;
