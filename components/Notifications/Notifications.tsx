"use client";
import { getAppIcon, getCategoryIcon } from "@/lib/functions";
import {
  ActionIcon,
  Group,
  Indicator,
  Paper,
  Popover,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBell,
  IconBellOff,
  IconCurrencyRupee,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationsTypes } from "./Notification.Types";

const Notifications = () => {
  const [opened, setOpened] = useState(false);
  const [notificationsList, setNotificationsList] = useState<
    NotificationsTypes[]
  >([]);
  const router = useRouter();
  useEffect(() => {
    const getNotifications = async () => {
      await axios
        .get("/api/notifications")
        .then((res) => {
          setNotificationsList(res.data);
        })
        .catch((error) =>
          notifications.show({
            message: "Not able to fetch the notifications.",
            icon: <IconX />,
            color: "red",
          })
        );
    };
    getNotifications();
  }, []);

  const goToNotificationLink = async (notification: NotificationsTypes) => {
    setOpened(false);
    await axios
      .delete(`/api/notifications?_id=${notification._id}`)
      .then((res) => {
        setNotificationsList(res.data);
        router.push(notification?.link);
      });
  };

  const deleteNotification = async (notification: NotificationsTypes) => {
    await axios
      .delete(`/api/notifications?_id=${notification._id}`)
      .then((res) => setNotificationsList(res.data));
  };

  return (
    <>
      <Popover
        opened={opened}
        onChange={setOpened}
        position="bottom-end"
        width={rem(360)}
        shadow="xl"
      >
        <Popover.Target>
          <Indicator
            inline
            disabled={!notificationsList.length}
            label={notificationsList.length}
            size={16}
            offset={7}
          >
            <ActionIcon
              onClick={() => setOpened((o) => !o)}
              color="grey"
              variant="transparent"
              size="lg"
            >
              <IconBell size={18} />
            </ActionIcon>
          </Indicator>
        </Popover.Target>
        <Popover.Dropdown>
          {notificationsList.length ? (
            notificationsList.map((notification) => (
              <Paper
                onClick={(e) => goToNotificationLink(notification)}
                key={String(notification?._id)}
                p="xs"
                withBorder
                mb="xs"
                shadow="xl"
                radius="md"
              >
                <Group wrap="nowrap" justify="space-between">
                  <Group wrap="nowrap" gap="xs">
                    <ThemeIcon variant="light" radius="xl">
                      {getAppIcon(notification?.type)}
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text>{notification?.message}</Text>
                      <Text size="xs" c="grey">
                        {dayjs(notification?.createdAt).format(
                          "DD MMM YYYY HH:mm"
                        )}
                      </Text>
                    </Stack>
                  </Group>
                  <ActionIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification);
                    }}
                    variant="transparent"
                    color="red"
                  >
                    <IconX />
                  </ActionIcon>
                </Group>
              </Paper>
            ))
          ) : (
            <Stack align="center">
              <ThemeIcon size={rem(64)} radius="xl" variant="light">
                <IconBellOff style={{ width: rem(32), height: rem(32) }} />
              </ThemeIcon>
              <Text size="xl">No notifications.</Text>
            </Stack>
          )}
        </Popover.Dropdown>
      </Popover>
    </>
  );
};

export default Notifications;
