import { colors } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import { ActionIcon, Avatar, Box, Divider, Group, Text } from "@mantine/core";
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
            alt={data?.user?.name || ""}
            variant="filled"
            color={colors[getDigitByString(data?.user?.name)]}
          >
            {getInitials(data?.user?.name)}
          </Avatar>
          <Text fw={500}>{user?.name}</Text>
        </Group>
        {data?.user?._id === group.user._id && (
          <ActionIcon
            onClick={() => updateUser(String(user._id))}
            variant="transparent"
            color="red"
          >
            <IconX />
          </ActionIcon>
        )}
      </Group>
      {form.values.users.length - 1 !== index && (
        <Divider my="xs" variant="dashed" />
      )}
    </Box>
  );
};

export default GroupUser;
