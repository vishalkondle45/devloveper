"use client";
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
  return (
    <>
      <Popover
        radius="lg"
        width={350}
        position="bottom-end"
        withArrow
        shadow="md"
        opened={opened}
        onChange={setOpened}
      >
        <PopoverTarget>
          <Avatar
            size="md"
            src={null}
            alt="Vishal Kondle"
            onClick={() => setOpened((o) => !o)}
          >
            VK
          </Avatar>
        </PopoverTarget>
        <PopoverDropdown px="xl">
          <Grid>
            <GridCol span={11}>
              <Text size="sm" ta="center" fw={700}>
                {data?.user?.email}
              </Text>
            </GridCol>
            <GridCol span={1}>
              <ActionIcon
                variant="subtle"
                radius="xl"
                onClick={() => setOpened(false)}
              >
                <IconX width={18} />
              </ActionIcon>
            </GridCol>
          </Grid>
          <Stack align="center" mt="md">
            <Avatar size="xl" src={null} alt="Vishal Kondle">
              VK
            </Avatar>
            <Title order={3}>Hi, Vishal</Title>
            <Group justify="space-between" wrap="nowrap">
              <Button
                leftSection={<IconSettings width={18} />}
                variant="outline"
                radius="xl"
                onClick={() => router.push("/profile")}
              >
                Manage Account
              </Button>
              <Button
                leftSection={<IconLogout width={18} />}
                variant="outline"
                radius="xl"
                onClick={() => signOut()}
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
