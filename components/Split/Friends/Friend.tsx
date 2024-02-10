import { colors } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import { ActionIcon, Avatar, Group, Paper, Text } from "@mantine/core";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { FriendProps } from "./Friends.Types";

const Friend = ({
  friend,
  acceptFriendship,
  rejectFriendship,
}: FriendProps) => {
  const { data } = useSession();
  const isSender = String(data?.user?._id) === friend.sender?._id;
  const otherUser = isSender ? friend.receiver : friend.sender;
  return (
    <Paper p="xs" ta="center" shadow="xl" withBorder>
      <Group justify="space-between">
        <Group gap="xs">
          <Avatar size="sm" color={colors[getDigitByString(otherUser.name)]}>
            {getInitials(otherUser.name)}
          </Avatar>
          <Text>{otherUser.name}</Text>
        </Group>
        <Group gap="xs">
          {friend.isAccepted ? (
            <ActionIcon
              onClick={() => rejectFriendship(friend._id)}
              color="red"
              size="sm"
              variant="transparent"
              title="Remove"
            >
              <IconTrash />
            </ActionIcon>
          ) : (
            <>
              {!isSender && (
                <ActionIcon
                  onClick={() => acceptFriendship(friend._id)}
                  color="green"
                  size="sm"
                  variant="transparent"
                  title="Accept"
                >
                  <IconCheck />
                </ActionIcon>
              )}
              <ActionIcon
                onClick={() => rejectFriendship(friend._id)}
                color="red"
                size="sm"
                variant="transparent"
                title="Reject"
              >
                <IconX />
              </ActionIcon>
            </>
          )}
        </Group>
      </Group>
    </Paper>
  );
};

export default Friend;
