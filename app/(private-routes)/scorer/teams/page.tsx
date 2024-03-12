"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { TeamType } from "@/components/Scorer/Scorer.Types";
import { colors } from "@/lib/constants";
import { getDigitByString } from "@/lib/functions";
import {
  Badge,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<TeamType[]>([]);
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Teams", href: "/scorer/teams" },
  ];

  const getTeams = async () => {
    const res = await axios.get("/api/scorer/teams");
    setTeams(res.data);
  };

  useEffect(() => {
    getTeams();
  }, []);

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group mt="lg" justify="space-between">
        <Text fz={rem(30)} fw={700}>
          My Teams
        </Text>
        <Button
          leftSection={<IconPlus />}
          onClick={() => router.push("/scorer/teams/create")}
        >
          Add Team
        </Button>
      </Group>
      <Stack mt="lg">
        {teams.map((team) => (
          <Paper p="sm" withBorder>
            <Group justify="space-between">
              <Text>
                {team.name} - {team.shortName}
              </Text>
              <Badge
                variant="outline"
                color={colors[getDigitByString(team.name)]}
                circle
                size="lg"
              >
                {team.players.length}
              </Badge>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default Page;
