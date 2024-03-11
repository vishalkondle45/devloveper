"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { errorNotification } from "@/lib/functions";
import {
  ActionIcon,
  Button,
  Center,
  Container,
  Group,
  LoadingOverlay,
  PinInput,
  Select,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useValidatedState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAt,
  IconBallTennis,
  IconBounceLeftFilled,
  IconCricket,
  IconSearch,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
const Page = () => {
  const { status } = useSession();
  const [{ value: email, valid }, setEmail] = useValidatedState(
    "",
    (val) => /^\S+@\S+$/.test(val),
    true
  );
  const [loading, { open, close }] = useDisclosure(false);
  const [verificationId, setVerificationId] = useState("");
  const [pin, setPin] = useState("");

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Players", href: "/scorer/players" },
    { title: "Add", href: "/scorer/players/create" },
  ];

  const form = useForm({
    initialValues: {
      user: "",
      name: "",
      bat: "Right",
      bowl: "Right",
      bowlingType: "Fast",
      role: "Batsman",
    },
    validate: {
      name: (value) => (value ? null : "This field is required"),
    },
  });

  const sendOtp = async () => {
    if (!valid) {
      errorNotification("Please enter valid email.");
      return;
    }
    form.reset();
    open();
    await axios
      .post(`/api/scorer/send-otp?email=${email}`)
      .then((res) => {
        setVerificationId(res.data);
      })
      .catch((error) => {
        errorNotification(error.response.data.error);
        setVerificationId("");
      })
      .finally(() => close());
  };

  const verifyPin = async () => {
    if (pin.length !== 4) {
      errorNotification("Please enter valid pin.");
      return;
    }
    open();
    await axios
      .post(`/api/scorer/verify-otp`, { _id: verificationId, pin, email })
      .then((res) => {
        form.setValues({ user: res.data._id, name: res.data.name });
      })
      .catch((error) => {
        errorNotification(error.response.data.error);
        if (error.response.status === 409) {
          setVerificationId("");
          setEmail("");
        }
        form.reset();
      })
      .finally(() => {
        close();
        setPin("");
      });
  };

  const createPlayer = async () => {
    try {
      open();
      await axios
        .post(`/api/scorer/players`, form.values)
        .then((res) => {
          notifications.show({
            message: "Player created successfully",
            color: "green",
            icon: <IconUserCheck size={16} />,
          });
          form.reset();
          setVerificationId("");
          setEmail("");
        })
        .catch((error) => {
          errorNotification(error);
        })
        .finally(() => close());
    } catch (error) {
      console.log(error);
      errorNotification("Creating player failed...");
    }
  };

  if (status === "loading" || loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Create Player
        </Text>
      </Group>
      <Container px={0} size="xs">
        <TextInput
          leftSection={<IconAt size={20} />}
          label="Email"
          placeholder="User email"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
            form.reset();
          }}
          mb="md"
          autoFocus
          rightSection={
            <ActionIcon onClick={sendOtp} size="lg">
              <IconSearch size={20} />
            </ActionIcon>
          }
        />
        <Center>
          {verificationId && !form.values.user && (
            <Stack>
              <PinInput
                placeholder="O"
                type="number"
                oneTimeCode
                value={pin}
                onChange={setPin}
                autoFocus
              />
              <Button
                type="submit"
                disabled={pin.length !== 4}
                onClick={verifyPin}
                fullWidth
              >
                Submit
              </Button>
            </Stack>
          )}
        </Center>
        {form.values.user && (
          <form onSubmit={form.onSubmit(createPlayer)}>
            <Stack>
              <TextInput
                leftSection={<IconUser size={20} />}
                label="Player name"
                placeholder="This will be autopopulated after entering email."
                disabled
                {...form.getInputProps("name")}
              />
              <Group justify="space-between" wrap="nowrap">
                <Select
                  label="Batting hand"
                  data={["Right", "Left"]}
                  {...form.getInputProps("bat")}
                  leftSection={<IconCricket size={20} />}
                  allowDeselect={false}
                />
                <Select
                  label="Bowling hand"
                  data={["Right", "Left"]}
                  {...form.getInputProps("bowl")}
                  leftSection={<IconBallTennis size={20} />}
                  allowDeselect={false}
                />
              </Group>
              <Group justify="space-between" wrap="nowrap">
                <Select
                  label="Role"
                  data={["Batsman", "Bowler", "Wicket Keeper", "Allrounder"]}
                  {...form.getInputProps("role")}
                  allowDeselect={false}
                  leftSection={<IconUserCheck size={20} />}
                />
                <Select
                  label="Bowling Type"
                  data={["Fast", "Medium", "Spin"]}
                  {...form.getInputProps("bowlingType")}
                  allowDeselect={false}
                  leftSection={<IconBounceLeftFilled size={20} />}
                />
              </Group>
              <Button type="submit" fullWidth>
                Submit
              </Button>
            </Stack>
          </form>
        )}
      </Container>
    </Container>
  );
};

export default Page;
