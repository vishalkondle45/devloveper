"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { PlayerProfileType } from "@/components/Scorer/Scorer.Types";
import { colors } from "@/lib/constants";
import { errorNotification, getDigitByString } from "@/lib/functions";
import {
  Badge,
  Box,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CaptainTag = () => (
  <ThemeIcon size={rem(18)} c={"dark"} radius="xl" variant="white">
    C
  </ThemeIcon>
);
const Page = () => {
  const { status } = useSession();
  const params = useParams();
  const [info, setInfo] = useState<PlayerProfileType>();
  const router = useRouter();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Player", href: "/scorer/player" },
    { title: info?.player?.user?.name || String(params?.id), href: "/player" },
  ];

  const getPlayer = async () => {
    try {
      const res = await axios.get(`/api/scorer/players?_id=${params?.id}`);
      setInfo(res.data);
    } catch (error) {
      errorNotification("Something went wrong");
      router.push("/scorer");
    }
  };

  useEffect(() => {
    getPlayer();
  }, []);

  if (status === "loading" || !info) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          {info?.player?.user.name}
        </Text>
      </Group>
      <Stack>
        <Box>
          <Text fz={rem(20)} fw={700}>
            Personal Information
          </Text>
          <Grid>
            <Grid.Col span={5}>
              <Text fw={500}>Role</Text>
              <Text fw={500}>Batting Hand</Text>
              <Text fw={500}>Bowling Hand</Text>
              <Text fw={500}>Bowling Style</Text>
            </Grid.Col>
            <Grid.Col span={7}>
              <Text>{info?.player?.role}</Text>
              <Text>{info?.player?.bat}</Text>
              <Text>{info?.player?.bowl}</Text>
              <Text>{info?.player?.bowlingType}</Text>
            </Grid.Col>
          </Grid>
        </Box>
        <Box>
          <Text fz={rem(20)} fw={700}>
            Teams
          </Text>
          <Stack gap={rem(6)}>
            {info?.teams?.map((team) => (
              <Badge
                size="lg"
                radius="xs"
                key={team?._id}
                color={colors[getDigitByString(String(team?.name))]}
                rightSection={
                  team?.captain === info?.player?._id && <CaptainTag />
                }
                style={{ justifyContent: "space-between" }}
                fullWidth
              >
                {team?.name}
              </Badge>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Page;
