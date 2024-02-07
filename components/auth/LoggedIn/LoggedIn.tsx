"use client";
import { colors } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import {
  ActionIcon,
  Avatar,
  Button,
  Grid,
  GridCol,
  Group,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconLogout, IconSettings, IconX } from "@tabler/icons-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoggedIn = ({ data }: { data: Session }) => {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const logout = () => {
    setOpened(false);
    signOut();
  };
  return (
    <>
      <Popover
        radius="xl"
        position="bottom-end"
        opened={opened}
        onChange={setOpened}
      >
        <PopoverTarget>
          {data?.user?.name && (
            <Avatar
              size="md"
              src={null}
              alt={data?.user?.name || ""}
              variant="filled"
              color={colors[getDigitByString(data?.user?.name)]}
              onClick={() => setOpened((o) => !o)}
            >
              {getInitials(data?.user?.name)}
            </Avatar>
          )}
        </PopoverTarget>
        <PopoverDropdown px="xl">
          <Grid>
            <GridCol span={11}>
              <Text size="sm" ta="center" fw={700}>
                {data?.user?.email}
              </Text>
            </GridCol>
            <GridCol span={1}>
              <ActionIcon variant="subtle" onClick={() => setOpened(false)}>
                <IconX width={18} />
              </ActionIcon>
            </GridCol>
          </Grid>
          <Stack align="center" mt="md">
            <Avatar
              size="xl"
              src={null}
              alt={data?.user?.name || ""}
              variant="filled"
              color={colors[getDigitByString(data?.user?.name)]}
            >
              {getInitials(data?.user?.name)}
            </Avatar>
            <Title order={3}>Hi, {data?.user?.name?.split(" ")[0]}</Title>
            <Group justify="space-between" wrap="nowrap">
              <Button
                leftSection={<IconSettings width={18} />}
                variant="outline"
                onClick={() => {
                  setOpened(false);
                  router.push("/profile");
                }}
              >
                Manage Account
              </Button>
              <Button
                leftSection={<IconLogout width={18} />}
                variant="outline"
                onClick={logout}
              >
                Logout
              </Button>
            </Group>
          </Stack>
        </PopoverDropdown>
      </Popover>
    </>
  );
};

export default LoggedIn;
