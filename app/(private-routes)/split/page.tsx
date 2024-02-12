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

  if (status === "loading" || !data) {
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
        <Box mt="lg">
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
                    w="max-content"
                    p="xs"
                    shadow="xl"
                    radius="lg"
                    withBorder
                    onClick={() => router.push(`/split/groups/${group?._id}`)}
                    style={{ cursor: "pointer" }}
                    key={group?._id}
                  >
                    <ThemeIcon variant="transparent">
                      {groupType && <groupType.icon />}
                    </ThemeIcon>
                    <Text fw={700}>{group?.title}</Text>
                  </Paper>
                );
              })}
            </Group>
          </ScrollArea>
        </Box>
        <Box mt="lg">
          <Title mb="xs" order={3}>
            Recent Paids
          </Title>
          <Stack>
            {data?.lastFivePaids?.map((paid: any) => {
              const groupType = groupTypes.find(
                ({ type }) => type === paid?.group?.type
              );
              return (
                <Paper
                  key={paid._id}
                  p="xs"
                  shadow="xl"
                  radius="lg"
                  withBorder
                  onClick={() =>
                    router.push(`/split/groups/${paid.group?._id}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <Group wrap="nowrap" justify="space-between">
                    <Group wrap="nowrap">
                      <ThemeIcon variant="light" radius="xl" size="xl">
                        {groupType && <groupType.icon />}
                      </ThemeIcon>
                      <Stack gap={0}>
                        <Text fw={700}>{paid.expense?.description}</Text>
                        <Text fw={300}>{paid.group?.title}</Text>
                      </Stack>
                    </Group>
                    <Text style={{ whiteSpace: "nowrap" }} fw={700} c="red">
                      <NumberFormatter
                        value={paid?.amount?.toFixed(2)}
                        prefix="₹ "
                        thousandsGroupStyle="lakh"
                        thousandSeparator=","
                        decimalSeparator="."
                        decimalScale={2}
                      />
                    </Text>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Box>
        <Box mt="lg">
          <Title mb="xs" order={3}>
            Recent Splits
          </Title>
          <Stack>
            {data?.lastFiveSplits?.map((split: any) => {
              const groupType = groupTypes.find(
                ({ type }) => type === split?.group?.type
              );
              return (
                <Paper
                  key={split?._id}
                  p="xs"
                  shadow="xl"
                  radius="lg"
                  onClick={() =>
                    router.push(`/split/groups/${split?.group?._id}`)
                  }
                  style={{ cursor: "pointer" }}
                  withBorder
                >
                  <Group wrap="nowrap" justify="space-between">
                    <Group wrap="nowrap">
                      <ThemeIcon variant="light" radius="xl" size="xl">
                        {groupType && <groupType.icon />}
                      </ThemeIcon>
                      <Stack gap={0}>
                        <Text fw={700}>{split?.expense?.description}</Text>
                        <Text fw={300}>{split?.group?.title}</Text>
                      </Stack>
                    </Group>
                    <Text style={{ whiteSpace: "nowrap" }} fw={700} c="red">
                      <NumberFormatter
                        value={split?.amount?.toFixed(2)}
                        prefix="₹ "
                        thousandsGroupStyle="lakh"
                        thousandSeparator=","
                        decimalSeparator="."
                        decimalScale={2}
                      />
                    </Text>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Box>
      </Container>
    </Container>
  );
};

export default Page;
