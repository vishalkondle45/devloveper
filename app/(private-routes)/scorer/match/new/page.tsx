"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { TeamFullType } from "@/components/Scorer/Scorer.Types";
import { roles } from "@/lib/constants";
import { errorNotification } from "@/lib/functions";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  List,
  LoadingOverlay,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCoinRupee,
  IconLetterH,
  IconLetterT,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import axios from "axios";
import Chance from "chance";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();
  const [teams, setTeams] = useState<TeamFullType[]>([]);
  const [toss, setToss] = useState(true);
  const [loading, { open, close }] = useDisclosure(true);
  const chance = new Chance();
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();

  const formHome = useForm({
    initialValues: {
      squad: [] as string[],
      captain: "",
    },
  });

  const formAway = useForm({
    initialValues: {
      squad: [] as string[],
      captain: "",
    },
  });

  const formMatch = useForm({
    initialValues: {
      home: "",
      away: "",
      overs: NaN as number,
      city: "",
      toss: "",
      choosen: "",
    },
    validate: {
      home: (value, values) =>
        value === ""
          ? "Please select a team"
          : values.away === value
          ? "Please select different teams"
          : null,
      away: (value, values) =>
        value === ""
          ? "Please select a team"
          : values.home === value
          ? "Please select different teams"
          : null,
    },
  });

  const formInning = useForm({
    initialValues: {
      batting: "",
      bowling: "",
      striker: "",
      nonStriker: "",
      bowler: "",
    },
  });

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Match", href: "/scorer/match" },
  ];

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((c) => {
      if (!formMatch.values.home || !formMatch.values.away) {
        errorNotification("Please select both teams.");
        return c;
      }
      if (formMatch.values.home === formMatch.values.away) {
        errorNotification("Both teams can't be same.");
        return c;
      }
      if (c === 1) {
        if (!formHome.values.squad.length || !formAway.values.squad.length) {
          errorNotification("Please select atleast 1 player from each team.");
          return c;
        }
        if (formHome.values.squad.length !== formAway.values.squad.length) {
          errorNotification("Please select equal number of players.");
          return c;
        }
        const check = formHome.values.squad.filter((v) =>
          formAway.values.squad.includes(v)
        ).length;
        if (check) {
          errorNotification("Same player can't be selected in both teams.");
          return c;
        }
      }
      if (c < 3) {
        return c + 1;
      }
      if (c === 3) {
        console.log("Let's Begin " + c);
        startMatch();
      }
      return c;
    });
  const prevStep = () => setActive((c) => (c > 0 ? c - 1 : c));

  const getTeams = async () => {
    try {
      open();
      const res = await axios.get("/api/scorer/teams");
      setTeams(res.data);
    } catch (error) {
      errorNotification("Internal server error");
    } finally {
      close();
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  function flipTheCoin() {
    let counter = 0;
    const intervalId = setInterval(() => {
      setToss(chance.bool());
      counter++;
      if (counter >= 45) {
        clearInterval(intervalId);
      }
    }, 70);
  }

  const startMatch = async () => {
    try {
      const res = await axios.post("/api/scorer/start-match", {
        match: formMatch.values,
        home: formHome.values,
        away: formAway.values,
        inning: formInning.values,
      });
      if (res.data) {
        formMatch.reset();
        formHome.reset();
        formAway.reset();
        router.push(`/scorer/match/${res.data._id}`);
      }
    } catch (error) {
      errorNotification("Internal server error");
    }
  };

  useEffect(() => {
    const { toss, choosen, home, away } = formMatch.values;
    if (toss && choosen) {
      if (choosen === "Bat") {
        formInning.setFieldValue("batting", toss === home ? home : away);
        formInning.setFieldValue("bowling", toss === home ? away : home);
      } else {
        formInning.setFieldValue("batting", toss === home ? away : home);
        formInning.setFieldValue("bowling", toss === home ? home : away);
      }
    }
  }, [formMatch.values.toss, formMatch.values.choosen]);

  if (status === "loading" || loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Match
        </Text>
      </Group>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        size="xs"
        iconSize={32}
      >
        <Stepper.Step
          icon={<IconUsersGroup style={{ width: rem(18), height: rem(18) }} />}
          title="Select Teams"
        >
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Select
              required
              data={teams.map(({ _id, name }) => ({ value: _id, label: name }))}
              label="Home Team"
              {...formMatch.getInputProps("home")}
              allowDeselect={false}
            />
            <Select
              required
              data={teams.map(({ _id, name }) => ({ value: _id, label: name }))}
              label="Away Team"
              {...formMatch.getInputProps("away")}
              allowDeselect={false}
            />
          </SimpleGrid>
        </Stepper.Step>
        <Stepper.Step
          icon={<IconUser style={{ width: rem(18), height: rem(18) }} />}
          title="Select Players"
        >
          <Text fw={700}>Select Players</Text>
          <SimpleGrid cols={{ base: 1, xs: 2 }}>
            <Checkbox.Group
              {...formHome.getInputProps("squad")}
              label={teams?.find((t) => t._id === formMatch.values.home)?.name}
            >
              {teams
                ?.find((t) => t._id === formMatch.values.home)
                ?.players?.map((player) => (
                  <Checkbox
                    key={player._id}
                    my={rem(6)}
                    radius="xl"
                    value={player?._id}
                    label={player?.user?.name}
                  />
                ))}
            </Checkbox.Group>
            <Checkbox.Group
              {...formAway.getInputProps("squad")}
              label={teams?.find((t) => t._id === formMatch.values.away)?.name}
            >
              {teams
                ?.find((t) => t._id === formMatch.values.away)
                ?.players?.map((player) => (
                  <Checkbox
                    key={player._id}
                    my={rem(6)}
                    radius="xl"
                    value={player?._id}
                    label={player?.user?.name}
                  />
                ))}
            </Checkbox.Group>
          </SimpleGrid>
        </Stepper.Step>
        <Stepper.Step
          icon={<IconCoinRupee style={{ width: rem(18), height: rem(18) }} />}
          title="Toss"
        >
          <Stack gap={rem(0)} ta="center">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <motion.div
                className="coin"
                onClick={flipTheCoin}
                animate={{ rotateX: toss ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: 24,
                  perspective: "1000px",
                }}
              >
                <ActionIcon
                  size={rem(130)}
                  radius="50%"
                  color={colorScheme === "dark" ? "white" : "dark"}
                  c={colorScheme === "dark" ? "dark" : "white"}
                  variant={colorScheme === "dark" ? "white" : "filled"}
                >
                  {toss ? <IconLetterH size={90} /> : <IconLetterT size={90} />}
                </ActionIcon>
              </motion.div>
            </div>
            <Text fw={700}>Click to Flip</Text>
          </Stack>
          <SimpleGrid
            cols={{ base: 1, xs: 2 }}
            spacing="xs"
            verticalSpacing="xs"
          >
            <SimpleGrid
              cols={{ base: 1, xs: 2 }}
              spacing="xs"
              verticalSpacing="xs"
            >
              <Select
                required
                data={teams
                  .find((t) => t._id === formMatch.values.home)
                  ?.players?.filter((p) =>
                    formHome.values.squad.includes(p._id)
                  )
                  .map((p) => ({ value: p._id, label: p.user.name }))}
                label={`${
                  teams?.find((t) => t._id === formMatch.values.home)?.name
                } - Captain`}
                {...formHome.getInputProps("captain")}
                allowDeselect={false}
              />
              <Select
                required
                data={teams
                  .find((t) => t._id === formMatch.values.away)
                  ?.players?.filter((p) =>
                    formAway.values.squad.includes(p._id)
                  )
                  .map((p) => ({ value: p._id, label: p.user.name }))}
                label={`${
                  teams?.find((t) => t._id === formMatch.values.away)?.name
                } - Captain`}
                {...formAway.getInputProps("captain")}
                allowDeselect={false}
              />
            </SimpleGrid>
            <SimpleGrid
              cols={{ base: 1, xs: 2 }}
              spacing="xs"
              verticalSpacing="xs"
            >
              <Select
                required
                data={teams
                  .filter(
                    ({ _id }) =>
                      _id === formMatch.values.home ||
                      _id === formMatch.values.away
                  )
                  .map((t) => ({ value: t._id, label: t.name }))}
                label="Who won the toss?"
                {...formMatch.getInputProps("toss")}
                allowDeselect={false}
              />
              <Select
                required
                data={["Bat", "Bowl"]}
                label="Winner of the toss elected to?"
                {...formMatch.getInputProps("choosen")}
                allowDeselect={false}
              />
            </SimpleGrid>
            <SimpleGrid
              cols={{ base: 1, xs: 2 }}
              spacing="xs"
              verticalSpacing="xs"
            >
              <Select
                required
                data={teams
                  .find((t) => t._id === formInning.values.batting)
                  ?.players?.filter((p) =>
                    (formInning.values.batting === formMatch.values.home
                      ? formHome
                      : formAway
                    ).values.squad.includes(p._id)
                  )
                  .map((p) => ({ value: p._id, label: p.user.name }))}
                label="Striker"
                {...formInning.getInputProps("striker")}
                allowDeselect={false}
              />
              <Select
                required
                data={teams
                  .find((t) => t._id === formInning.values.batting)
                  ?.players?.filter((p) =>
                    (formInning.values.batting === formMatch.values.home
                      ? formHome
                      : formAway
                    ).values.squad.includes(p._id)
                  )
                  .map((p) => ({ value: p._id, label: p.user.name }))}
                label="Non striker"
                {...formInning.getInputProps("nonStriker")}
                allowDeselect={false}
              />
            </SimpleGrid>
            <SimpleGrid
              cols={{ base: 1, xs: 2 }}
              spacing="xs"
              verticalSpacing="xs"
            >
              <Select
                required
                data={teams
                  .find((t) => t._id === formInning.values.batting)
                  ?.players?.filter((p) =>
                    (formInning.values.batting === formMatch.values.home
                      ? formAway
                      : formHome
                    ).values.squad.includes(p._id)
                  )
                  .map((p) => ({ value: p._id, label: p.user.name }))}
                label="Bowler"
                {...formInning.getInputProps("bowler")}
                allowDeselect={false}
              />
              <NumberInput
                label="No. of Overs"
                {...formMatch.getInputProps("overs")}
                min={1}
                required
              />
            </SimpleGrid>
          </SimpleGrid>
          {JSON.stringify(formMatch.values)}
          {JSON.stringify(formInning.values)}
        </Stepper.Step>
        <Stepper.Completed>
          <Title ta="center">Overview</Title>
          <Group gap={rem(4)}>
            <Text fw={700}>Overs - </Text>
            <Text fw={500}>{formMatch.values.overs}</Text>
          </Group>
          <Group gap={rem(4)}>
            <Text fw={700}>Location - </Text>
            <Text fw={500}>{formMatch.values.city}</Text>
          </Group>
          <SimpleGrid cols={{ base: 1, xs: 2 }}>
            <Box>
              <Text ta="center" mb="xs" size="xl" fw={700}>
                {teams.find(({ _id }) => formMatch.values.home === _id)?.name}{" "}
                {formMatch.values.toss === formMatch.values.home && (
                  <ThemeIcon size="sm" variant="transparent">
                    {
                      roles.find(
                        (role) =>
                          role.role ===
                          (formMatch.values.choosen === "Bowl"
                            ? "Bowler"
                            : "Allrounder")
                      )?.icon
                    }
                  </ThemeIcon>
                )}
              </Text>
              <List spacing="xs" size="sm" type="ordered" center>
                {formHome.values.squad.map((_id) => (
                  <List.Item
                    key={_id}
                    icon={
                      <ThemeIcon variant="transparent">
                        {
                          roles.find(
                            ({ role }) =>
                              role ===
                              teams
                                .find((t) => formMatch.values.home === t._id)
                                ?.players?.find((p) => p._id === _id)?.role
                          )?.icon
                        }
                      </ThemeIcon>
                    }
                    fw={700}
                  >
                    {formHome.values.captain === _id && (
                      <Badge mr="xs" variant="filled" size="sm" circle>
                        C
                      </Badge>
                    )}
                    {
                      teams
                        .find((t) => formMatch.values.home === t._id)
                        ?.players?.find((p) => p._id === _id)?.user.name
                    }
                  </List.Item>
                ))}
              </List>
            </Box>
            <Box>
              <Text ta="center" mb="xs" size="xl" fw={700}>
                {teams.find(({ _id }) => formMatch.values.away === _id)?.name}{" "}
                {formMatch.values.toss === formMatch.values.away && (
                  <ThemeIcon size="sm" variant="transparent">
                    {
                      roles.find(
                        (role) =>
                          role.role ===
                          (formMatch.values.choosen === "Bowl"
                            ? "Bowler"
                            : "Allrounder")
                      )?.icon
                    }
                  </ThemeIcon>
                )}
              </Text>
              <List spacing="xs" size="sm" center>
                {formAway.values.squad.map((_id) => (
                  <List.Item
                    key={_id}
                    icon={
                      <ThemeIcon variant="transparent">
                        {
                          roles.find(
                            (role) =>
                              role.role ===
                              teams
                                .find((t) => formMatch.values.away === t._id)
                                ?.players?.find((p) => p._id === _id)?.role
                          )?.icon
                        }
                      </ThemeIcon>
                    }
                    fw={700}
                  >
                    {formAway.values.captain === _id && (
                      <Badge mr="xs" variant="filled" size="sm" circle>
                        C
                      </Badge>
                    )}
                    {
                      teams
                        .find((t) => formMatch.values.away === t._id)
                        ?.players?.find((p) => p._id === _id)?.user.name
                    }
                  </List.Item>
                ))}
              </List>
            </Box>
          </SimpleGrid>
        </Stepper.Completed>
      </Stepper>
      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>
          {active === 3 ? "Let's Play" : "Next"}
        </Button>
      </Group>
    </Container>
  );
};

export default Page;
