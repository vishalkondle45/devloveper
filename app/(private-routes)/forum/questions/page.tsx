"use client";
import { ForumTypes } from "@/components/Forum/Forum.Types";
import ForumItem from "@/components/Forum/ForumItem/ForumItem";
import NewForum from "@/components/Forum/NewForum/NewForum";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Center,
  Container,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Pagination,
  Stack,
  Text,
  rem,
} from "@mantine/core";
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
          <ForumItem forum={forum} />
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
