"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { groupTypes } from "@/lib/constants";
import { Carousel } from "@mantine/carousel";
import {
  Box,
  Container,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  NumberFormatter,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Split", href: "/split" },
  ];

  const [data, setData] = useState<null | any>(null);
  const router = useRouter();

  useEffect(() => {
    const getSplit = async () => {
      const res = await axios.get("/api/split");
      setData(res.data);
    };
    getSplit();
  }, []);

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container mt="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Container size="xs" my="md" px={0}>
        <Paper p="lg" shadow="xl" radius="lg" withBorder>
          <Group>
            <Text>Total Balance</Text>
            <Text fw={700}>
              <NumberFormatter
                value={(data?.paidTotal - data?.splitTotal).toFixed(2)}
                prefix="₹ "
                thousandsGroupStyle="lakh"
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
              />
            </Text>
          </Group>
          <Divider variant="dashed" my="xs" size="sm" />
          <Group justify="space-evenly">
            <Stack align="center" gap={0}>
              <Text fw={700} c="green">
                <NumberFormatter
                  value={data?.paidTotal}
                  prefix="₹ "
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                />
              </Text>
              <Text>Your Spends</Text>
            </Stack>
            <Divider orientation="vertical" variant="dashed" size="sm" />
            <Stack align="center" gap={0}>
              <Text fw={700} c="red">
                <NumberFormatter
                  value={data?.splitTotal}
                  prefix="₹ "
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                />
              </Text>
              <Text>Your Share</Text>
            </Stack>
          </Group>
        </Paper>
        <Carousel
          mt="xl"
          nextControlIcon={
            <ThemeIcon color="gray" variant="filled" radius="xl">
              <IconChevronRight />
            </ThemeIcon>
          }
          previousControlIcon={
            <ThemeIcon color="gray" variant="filled" radius="xl">
              <IconChevronLeft />
            </ThemeIcon>
          }
          slideSize="80%"
          slideGap="md"
          withIndicators
          loop
        >
          <Carousel.Slide>
            <Image height={200} src="/split-home-1.webp" radius="lg" />
            <Text ta="center" fw={700}>
              Split easily with SplitEasy
            </Text>
          </Carousel.Slide>
          <Carousel.Slide>
            <Image height={200} src="/split-piechart.webp" radius="lg" />
            <Text ta="center" fw={700}>
              Analyze your bills
            </Text>
          </Carousel.Slide>
          <Carousel.Slide>
            <Image
              height={200}
              fit="fill"
              src="/split-categories-1.jpeg"
              radius="lg"
            />
            <Text ta="center" fw={700}>
              Category wise bills
            </Text>
          </Carousel.Slide>
        </Carousel>
        <Box mt="sm">
          <Title mb="xs" order={3}>
            Recent Groups
          </Title>
          <ScrollArea w="100%" scrollbarSize={5}>
            <Group gap="sm" wrap="nowrap">
              {data?.groups.map((group: any) => {
                const groupType = groupTypes.find(
                  ({ type }) => type === group?.type
                );
                return (
                  <Paper
                    px="lg"
                    ta="center"
                    w="min-content"
                    p="xs"
                    shadow="xl"
                    radius="lg"
                    withBorder
                    onClick={() => router.push(`/split/${group?._id}`)}
                    style={{ cursor: "pointer" }}
                    key={group?._id}
                  >
                    <ThemeIcon variant="transparent">
                      {groupType && <groupType.icon />}
                    </ThemeIcon>
                    <Text>{group?.title}</Text>
                  </Paper>
                );
              })}
            </Group>
          </ScrollArea>
        </Box>
      </Container>
    </Container>
  );
};

export default Page;
