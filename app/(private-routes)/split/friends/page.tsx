"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  ActionIcon,
  Box,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import axios from "axios";
import mongoose from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();
  const [friends, setFriends] = useState([]);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Split", href: "/split" },
    { title: "Friends", href: "/split/friends" },
  ];

  const getFriends = async () => {
    const res = await axios.get("/api/split/friends");
    setFriends(res.data);
  };

  const manageFriendship = async (friend: mongoose.Types.ObjectId) => {
    await axios.put(`/api/split/friends`, { friend });
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
      <Box my="sm">
        {friends.map(({ email, _id }) => (
          <Paper p="xs" ta="center" withBorder>
            <Group justify="space-between">
              <Text>{email}</Text>
              <ActionIcon onClick={() => manageFriendship(_id)} color="red">
                <IconX />
              </ActionIcon>
            </Group>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Page;
