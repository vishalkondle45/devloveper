"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { Scorer } from "@/components/Scorer/Scorer.Types";
import { errorNotification } from "@/lib/functions";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBallTennis,
  IconCricket,
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber6,
} from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const params = useParams();
  const [data, setData] = useState<Scorer>();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Match", href: "/scorer/match" },
    { title: "Match_ID", href: "/scorer/match/id" },
  ];

  useEffect(() => {
    const getMatch = async () => {
      try {
        const res = await axios.get(`/api/scorer/match/scorer/${params.id}`);
        setData(res.data);
      } catch (error) {
        errorNotification("Internal server error");
      }
    };
    // getMatch();
  }, []);

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group mt="sm" justify="space-between">
        <Text
          fw={700}
          fz="xl"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {data?.match.home.name || "Mumbai Indians"} vs{" "}
          {data?.match.away.name || "Royal Challengers Banglore"}
        </Text>
      </Group>
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs" verticalSpacing="xs">
        <Paper ta="center">
          <Group gap="xs" justify="center">
            <Title>7/0</Title>
            <Text>(0.0/20)</Text>
          </Group>
          <Text>Test won the toss and elected to bat</Text>
          <Paper p="md" withBorder>
            <SimpleGrid cols={2}>
              <Box ta="left">
                <Group gap={0} align="flex-start">
                  <Text>Naidu</Text>
                  <ThemeIcon variant="transparent">
                    <IconCricket size={18} />
                  </ThemeIcon>
                </Group>
                <Text>0(0)</Text>
              </Box>
              <Box ta="left">
                <Group gap={0} align="flex-start">
                  <Text>Naidu</Text>
                  <ThemeIcon variant="transparent">
                    <IconCricket size={18} />
                  </ThemeIcon>
                </Group>
                <Text>0(0)</Text>
              </Box>
            </SimpleGrid>
            <Divider variant="dashed" my="sm" />
            <Box>
              <Stack gap="xs">
                <Group justify="space-between" align="center">
                  <Group gap={0}>
                    <ThemeIcon variant="transparent">
                      <IconBallTennis size={18} />
                    </ThemeIcon>
                    <Text>Naidu</Text>
                  </Group>
                  <Text>0.0-0-7-0</Text>
                </Group>
                <ScrollArea.Autosize maw="100%">
                  <Group justify="left" wrap="nowrap">
                    <Stack gap={0}>
                      <Badge size="xl" circle>
                        1
                      </Badge>
                      <Text size="xs" c="gray">
                        WD
                      </Text>
                    </Stack>
                  </Group>
                </ScrollArea.Autosize>
              </Stack>
            </Box>
          </Paper>
        </Paper>
        <Box>
          <SimpleGrid spacing="xs" cols={3}>
            <Button variant="outline" color="gray">
              <IconNumber0 />
            </Button>
            <Button variant="outline" color="blue">
              <IconNumber1 />
            </Button>
            <Button variant="outline" color="blue">
              <IconNumber2 />
            </Button>
            <Button variant="outline" color="blue">
              <IconNumber3 />
            </Button>
            <Button variant="filled">
              <IconNumber4 />
            </Button>
            <Button variant="filled">
              <IconNumber6 />
            </Button>
            <Button variant="outline">WD</Button>
            <Button variant="outline">NB</Button>
            <Button variant="outline">BYE</Button>
            <Button variant="outline">5,7</Button>
            <Button variant="filled" color="red">
              OUT
            </Button>
            <Button variant="outline" color="orange">
              LB
            </Button>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Page;
