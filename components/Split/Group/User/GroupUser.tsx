import { colors } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Divider,
  Group,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { GroupUserProps } from "./User.Types";

const GroupUser = ({
  user,
  form,
  index,
  updateUser,
  group,
}: GroupUserProps) => {
  const { data } = useSession();

  return (
    <Box key={String(user._id)}>
      <Group justify="space-between">
        <Group gap="xs" justify="left">
          <Avatar
            size="sm"
            src={null}
            alt={user?.name || ""}
            variant="filled"
            color={colors[getDigitByString(user?.name)]}
          >
            {getInitials(user?.name)}
          </Avatar>
          <Text fw={500}>{user?.name}</Text>
        </Group>
        <Group>
          {data?.user?._id === group.user._id && user._id === group.user._id ? (
            <Badge color="red">Admin</Badge>
          ) : (
            <ActionIcon
              onClick={() => updateUser(String(user._id))}
              variant="transparent"
              color="red"
            >
              <IconX />
            </ActionIcon>
          )}
        </Group>
      </Group>
      {form.values.users.length - 1 !== index && (
        <Divider my="xs" variant="dashed" />
      )}
    </Box>
  );
};

export default GroupUser;
