"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { TeamType } from "@/components/Scorer/Scorer.Types";
import { roles } from "@/lib/constants";
import { errorNotification } from "@/lib/functions";
import {
  ActionIcon,
  Badge,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<TeamType>();
  const [loading, { open, close }] = useDisclosure(true);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Teams", href: "/scorer/teams" },
    { title: team?.shortName || "", href: "" },
  ];

  const getTeam = async () => {
    try {
      open();
      const teamId = params.id;
      if (!teamId) {
        router.push("/scorer/teams");
        errorNotification("Invalid Team ID");
        return;
      }
      const { data } = await axios.get(`/api/scorer/teams/${teamId}`);
      setTeam(data);
      close();
    } catch (error: any) {
      errorNotification(error.response.data.error);
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

  if (status === "loading" || loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Container mt="lg" size="xs" px={0}>
        <Group justify="space-between">
          <Text fz={rem(30)} fw={700}>
            {team?.name}
          </Text>
        </Group>
        <Group mb="xs" justify="right">
          <ActionIcon
            variant="transparent"
            color="blue"
            onClick={() => router.push(`/scorer/teams/update/${team?._id}`)}
          >
            <IconPencil />
          </ActionIcon>
          <ActionIcon variant="transparent" color="red">
            <IconTrash />
          </ActionIcon>
        </Group>
        <Stack>
          {team?.players?.map((player: any) => (
            <Paper p="xs" key={player._id} withBorder>
              <Group justify="space-between" gap="xs">
                <Group gap="xs">
                  <ThemeIcon variant="transparent">
                    {roles.find((role) => role.role === player?.role)?.icon}
                  </ThemeIcon>
                  <Text fw={700}>{player.user.name}</Text>
                </Group>
                {team.captain === player._id && <Badge circle>C</Badge>}
              </Group>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Container>
  );
};

export default Page;
