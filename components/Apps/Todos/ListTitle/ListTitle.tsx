import { sortOptions } from "@/lib/constants";
import {
  ActionIcon,
  Group,
  Menu,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconCursorText,
  IconDots,
  IconList,
  IconPrinter,
  IconSun,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Props, SortOptionProps } from "./ListTitle.types";

const ListTitle = (props: Props) => {
  return (
    <Stack gap="xs" my="sm">
      <Group wrap="nowrap" justify="space-between">
        <Group wrap="nowrap" justify="left" gap="xs">
          <ThemeIcon variant="transparent">
            {props.icon ? <props.icon /> : <IconList />}
          </ThemeIcon>
          <Text maw={rem("60vw")} fz={rem(24)} fw={700} truncate="end">
            {props.title}
          </Text>
          <Menu radius="xs" shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon color="gray" variant="transparent">
                <IconDots stroke={1} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label ta="center">List options</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconCursorText style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Rename list
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconPrinter style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Print list
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSun style={{ width: rem(16), height: rem(16) }} />
                }
                rightSection={
                  <IconChevronRight
                    style={{ width: rem(16), height: rem(16) }}
                  />
                }
              >
                Change theme
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={
                  <IconTrash style={{ width: rem(16), height: rem(16) }} />
                }
                color="red"
              >
                Delete list
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Menu radius="xs" shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon color="gray" variant="transparent">
              <IconArrowsSort stroke={1} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label ta="center">Sort by</Menu.Label>
            {sortOptions.map((item: SortOptionProps) => (
              <Menu.Item
                key={item.name}
                leftSection={
                  <item.icon style={{ width: rem(16), height: rem(16) }} />
                }
                onClick={() =>
                  props.setSort(() => ({ sort: "asc", by: item.name }))
                }
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
      {props.sort.by && (
        <Group gap="xs" justify="right">
          <ActionIcon
            color="gray"
            variant="transparent"
            size="sm"
            onClick={() =>
              props.setSort((old) => ({
                ...old,
                sort: old.sort === "asc" ? "desc" : "asc",
              }))
            }
          >
            {props.sort.sort === "asc" ? (
              <IconChevronUp />
            ) : (
              <IconChevronDown />
            )}
          </ActionIcon>
          <Text fz="sm" fw={700}>
            {sortOptions.find((item) => item.name === props.sort.by)?.label}
          </Text>
          <ActionIcon
            color="gray"
            variant="transparent"
            size="sm"
            onClick={() =>
              props.setSort((old) => ({ ...old, sort: "asc", by: "" }))
            }
          >
            <IconX />
          </ActionIcon>
        </Group>
      )}
    </Stack>
  );
};

export default ListTitle;
