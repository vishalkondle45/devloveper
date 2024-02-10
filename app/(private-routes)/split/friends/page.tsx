"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import Friend from "@/components/Split/Friends/Friend";
import {
  FriendType,
  FriendsTypes,
} from "@/components/Split/Friends/Friends.Types";
import {
  ActionIcon,
  Box,
  Container,
  LoadingOverlay,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useValidatedState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAt, IconCheck, IconSend, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
  const { status, data } = useSession();
  const [friends, setFriends] = useState<FriendsTypes>([]);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Split", href: "/split" },
    { title: "Friends", href: "/split/friends" },
  ];

  const getFriends = async () => {
    const res = await axios.get("/api/split/friends");
    setFriends(res.data);
  };

  const [{ value, valid }, setEmail] = useValidatedState(
    "",
    (val) => /^\S+@\S+$/.test(val),
    true
  );

  const sendFriendRequst = async () => {
    if (!valid) {
      notifications.show({
        message: "Please enter valid email.",
        icon: <IconX />,
        color: "red",
      });
      return;
    }
    await axios
      .post(`/api/split/friends`, { email: value })
      .then((res) => {
        setFriends(res.data);
        setEmail("");
        notifications.show({
          message: "Friend request sent...",
          icon: <IconCheck />,
          color: "green",
        });
      })
      .catch((error) => {
        notifications.show({
          message: error.response.data.error,
          icon: <IconX />,
          color: "red",
        });
      });
  };

  // vishalkondle@gmail.com
  const acceptFriendship = async (_id: string) => {
    await axios
      .put(`/api/split/friends?_id=${_id}`, { isAccepted: true })
      .then((res) => {
        setFriends(res.data);
      })
      .catch((error) => {
        notifications.show({
          message: error.response.data.error,
          icon: <IconX />,
          color: "red",
        });
      });
  };
  const rejectFriendship = async (_id: string) => {
    await axios
      .delete(`/api/split/friends?_id=${_id}`)
      .then((res) => {
        setFriends(res.data);
      })
      .catch((error) => {
        notifications.show({
          message: error.response.data.error,
          icon: <IconX />,
          color: "red",
        });
      });
  };

  useEffect(() => {
    getFriends();
  }, []);

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container mt="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Container size="xs" px={0} my="sm">
        <TextInput
          w="100%"
          leftSection={<IconAt size={18} />}
          rightSection={
            <ActionIcon
              variant="filled"
              disabled={!Boolean(value) || !valid}
              onClick={sendFriendRequst}
            >
              <IconSend size={18} />
            </ActionIcon>
          }
          value={value}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="Enter email address"
          mb="sm"
          error={value && !valid && "Please enter valid email"}
        />
        {friends.some(
          (i) => !i.isAccepted && i.receiver._id === String(data?.user?._id)
        ) && (
          <Box my="xs">
            <Title order={4}>Received Friend Requests</Title>
            <Stack mt="sm" gap="xs">
              {friends
                .filter(
                  (i) =>
                    !i.isAccepted && i.receiver._id === String(data?.user?._id)
                )
                .map((friend: FriendType) => (
                  <Friend
                    key={friend._id}
                    friend={friend}
                    acceptFriendship={acceptFriendship}
                    rejectFriendship={rejectFriendship}
                  />
                ))}
            </Stack>
          </Box>
        )}
        {friends.some(
          (i) => !i.isAccepted && i.sender._id === String(data?.user?._id)
        ) && (
          <Box my="xs">
            <Title order={4}>Sent Friend Requests</Title>
            <Stack mt="sm" gap="xs">
              {friends
                .filter(
                  (i) =>
                    !i.isAccepted && i.sender._id === String(data?.user?._id)
                )
                .map((friend: FriendType) => (
                  <Friend
                    key={friend._id}
                    friend={friend}
                    acceptFriendship={acceptFriendship}
                    rejectFriendship={rejectFriendship}
                  />
                ))}
            </Stack>
          </Box>
        )}
        {friends.some((i) => i.isAccepted) && (
          <Box my="xs">
            <Title order={4}>Friends</Title>
            <Stack mt="sm" gap="xs">
              {friends
                .filter((i) => i.isAccepted)
                .map((friend: FriendType) => (
                  <Friend
                    key={friend._id}
                    friend={friend}
                    acceptFriendship={acceptFriendship}
                    rejectFriendship={rejectFriendship}
                  />
                ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default Page;
