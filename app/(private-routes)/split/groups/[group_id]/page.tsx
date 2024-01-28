"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  ExpenseUser,
  GroupType,
  GroupUserType,
} from "@/components/Split/Group/Group.Types";
import GroupUser from "@/components/Split/Group/User/GroupUser";
import { AutoCompleteDataType } from "@/components/Split/Group/User/User.Types";
import { colors, expenseCategories, groupTypes } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  Checkbox,
  ComboboxItem,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  NumberFormatter,
  NumberInput,
  Paper,
  Popover,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useListState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications, showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconCurrencyRupee,
  IconSelector,
  IconSettings,
  IconTrash,
  IconUserSearch,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import mongoose from "mongoose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status, data } = useSession();
  const userId = data?.user?._id || new mongoose.Types.ObjectId();
  const [group, setGroup] = useState<GroupType | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [newExpenseOpened, newExpenseHandler] = useDisclosure(false);
  const [value, setValue] = useState<ComboboxItem | null>(null);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [opened1, setOpened] = useState(false);
  const [opened2, setOpened2] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const params = useParams();
  const router = useRouter();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Split", href: "/split" },
    { title: "Groups", href: "/split/groups" },
    {
      title: String(group?.title) || String(params?.group_id),
      href: String(params?.group_id),
    },
  ];

  const form = useForm({
    initialValues: {
      title: "",
      type: "home",
      users: [],
      user: new mongoose.Types.ObjectId(),
    },
    validate: {
      title: (value) => (value ? null : "This field is required."),
    },
  });

  const eForm = useForm({
    initialValues: {
      description: "",
      category: "general",
      isMultiPayer: false,
      price: 0,
      isEquallySplit: true,
    },
    validate: {
      description: (value) => (value ? null : "This field is required."),
    },
  });

  const [users, usersHandlers] = useListState<any>([]);
  const [paidBy, paidByHandlers] = useListState<ExpenseUser>([
    { user: userId },
  ]);
  const [splitAmong, splitAmongHandlers] = useListState<ExpenseUser>([]);
  const splitTotal = splitAmong.reduce(
    (accum, item) => accum + (item?.amount || 0),
    0
  );
  const paidTotal = paidBy.reduce(
    (accum, item) => accum + (item?.amount || 0),
    0
  );

  useEffect(() => {
    if (group?.users.length) {
      usersHandlers.setState(
        group?.users.map((user: GroupUserType) => ({
          user: user._id,
          name: user.name,
        }))
      );
    }
  }, [group?._id]);

  useEffect(() => {
    paidByHandlers.setState([{ user: userId, amount: eForm.values.price }]);
    if (users) {
      splitAmongHandlers.setState([
        ...users.map(({ user }) => ({ user, amount: 0, active: true })),
        { user: userId, amount: 0, active: true },
      ]);
    }
  }, [users]);

  const setEForm = (key: string, value: any) => eForm.setFieldValue(key, value);
  const isCategory = (category: string) => eForm.values.category === category;
  const isMulti = eForm.values.isMultiPayer ? "multi" : "single";
  const isEqually = eForm.values.isEquallySplit ? "equally" : "unequally";

  const getGroup = async () => {
    await axios
      .get(`/api/split/groups/${params?.group_id}`)
      .then((res) => {
        setGroup(res?.data);
        form.setValues(res?.data);
      })
      .catch((error) => router.push("/split/groups"));
  };

  const getExpenses = async () => {
    await axios
      .get(`/api/split/groups/${params?.group_id}/expenses`)
      .then((res) => {
        setExpenses(res.data);
      })
      .catch((error) => router.push("/split/groups"));
  };

  const groupType = groupTypes.find(({ type }) => type === group?.type);

  const deleteGroup = async () => {
    modals.openConfirmModal({
      title: <Text size="lg">Delete group forever?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await axios.delete(`/api/split/groups/${params?.group_id}`).then(() => {
          notifications.show({
            message: "Group deleted",
            icon: <IconCheck />,
            color: "green",
          });
          router.push("/split/groups");
        });
      },
    });
  };

  const update = async (
    property: "title" | "type" | "users",
    value: string | never[]
  ) => {
    await axios
      .put(`/api/split/groups/${params?.group_id}`, { [property]: value })
      .then((res) => getGroup())
      .catch((error) => console.log(error));
  };

  const getFriends = async () => {
    const res = await axios.get(`/api/split/groups/${params?.group_id}/users`);
    setFriends(
      res.data.map((item: AutoCompleteDataType) => ({
        value: item._id,
        label: item.name,
      }))
    );
  };

  const updateUser = async (user: string | null) => {
    await axios
      .put(`/api/split/groups/${params?.group_id}/users`, {
        user,
      })
      .then(() => setSearchValue(""))
      .then(() => getGroup())
      .then(() => getFriends())
      .then(() => getExpenses());
  };

  const handlePaidByUser = (user: mongoose.Types.ObjectId | undefined) => {
    if (!user) return;
    if (isMulti === "multi") {
      if (paidBy.filter((item) => item.user === user).length) {
        if (paidBy.length > 1) {
          paidByHandlers.setState((current) =>
            current.filter((item) => item.user !== user)
          );
        }
      } else {
        paidByHandlers.append({ user, amount: 0 });
      }
    } else {
      paidByHandlers.setState([{ user, amount: eForm.values.price }]);
    }
  };

  const handlePaidByAmount = (
    user: mongoose.Types.ObjectId | undefined,
    amount: number
  ) => {
    paidByHandlers.applyWhere(
      (item) => item.user === user,
      (item) => ({ ...item, amount })
    );
  };

  useEffect(() => {
    // if (eForm.values.isMultiPayer) {
    paidByHandlers.setState([
      {
        user: userId,
        amount: eForm.values.price,
      },
    ]);
    // }
  }, [isMulti]);

  useEffect(() => {
    splitAmongHandlers.apply((item) => ({
      user: item.user,
      amount: (eForm?.values?.price || 0) / splitAmong.length,
      active: true,
    }));
  }, [eForm.values.price]);

  useEffect(() => {
    splitAmongHandlers.apply((item) => ({
      user: item.user,
      amount: eForm.values.isEquallySplit
        ? (eForm?.values?.price || 0) / splitAmong.length
        : 0,
      active: true,
    }));
  }, [isEqually]);

  const submitExpense = async () => {
    if (!eForm.values.description) {
      showNotification({
        message: "Description is required field.",
        icon: <IconX />,
        color: "red",
      });
      return;
    }
    if (eForm.values.price < 1) {
      showNotification({
        message: "Price is required field.",
        icon: <IconX />,
        color: "red",
      });
      return;
    }
    if (paidTotal !== eForm.values.price) {
      showNotification({
        message: "Paid by total is not equal to price.",
        icon: <IconX />,
        color: "red",
      });
      setOpened2(true);
      return;
    }
    if (splitTotal !== eForm.values.price) {
      showNotification({
        message: "Split among total is not equal to price.",
        icon: <IconX />,
        color: "red",
      });
      return;
    }
  };

  const handleSplitAmong = (user: mongoose.Types.ObjectId) => {
    splitAmongHandlers.setState((old) =>
      old.map((value) => ({
        ...value,
        active: user === value.user ? !value.active : value.active,
      }))
    );
    splitAmongHandlers.setState((old) =>
      old.map((value) => ({
        ...value,
        amount: value.active
          ? eForm?.values?.price /
            old.filter((user) => user.active === true).length
          : 0,
      }))
    );
    console.log({ splitAmong });
  };

  const handleSplitAmongAmount = (
    user: mongoose.Types.ObjectId,
    amount: number
  ) => {
    splitAmongHandlers.applyWhere(
      (item) => item.user === user,
      (item) => ({ ...item, amount })
    );
    console.log(splitAmong);
  };

  useEffect(() => {
    getGroup();
    getFriends();
    getExpenses();
  }, []);

  if (status === "loading" || !group) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container mt="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Paper my="md" p="xs" withBorder>
        <Group wrap="nowrap" justify="space-between">
          <Group wrap="nowrap">
            <ThemeIcon variant="light" radius="xl" size="xl">
              {groupType && <groupType.icon />}
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={700}>{group.title}</Text>
              <Group gap={rem(6)}>
                <Text>Created by</Text>
                <Tooltip label={data?.user?.name} withArrow>
                  <Avatar
                    size="sm"
                    src={null}
                    alt={data?.user?.name || ""}
                    variant="filled"
                    color={colors[getDigitByString(data?.user?.name)]}
                  >
                    {getInitials(data?.user?.name)}
                  </Avatar>
                </Tooltip>
                <Text fw={700}>
                  {group?.user === userId ? "You" : "Others"}
                </Text>
              </Group>
            </Stack>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <ActionIcon onClick={open} radius="xl">
              <IconSettings style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
            <ActionIcon color="red" onClick={deleteGroup} radius="xl">
              <IconTrash style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
      <Button onClick={newExpenseHandler.open}>Add Expense</Button>
      <Modal opened={opened} title="Edit Group" onClose={close}>
        <TextInput
          label="Group name"
          placeholder="Enter a group name"
          {...form.getInputProps("title")}
          mb="xs"
          onBlur={() => update("title", form.values.title)}
        />
        <Text fw={500} fz="sm">
          Type
        </Text>
        <SegmentedControl
          w={rem("100%")}
          color="teal"
          size="xs"
          data={groupTypes.map((group) => ({
            key: group.type,
            value: group.type,
            label: (
              <Center>
                <group.icon />
              </Center>
            ),
          }))}
          mb="xs"
          {...form.getInputProps("type")}
          onChange={(value) => update("type", value)}
        />
        <Text fw={500} fz="sm">
          Users
        </Text>
        <Paper p="sm" withBorder>
          <Select
            searchable
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            data={friends}
            value={value ? value.value : null}
            onChange={(_value) => updateUser(_value)}
            mb="sm"
            leftSection={<IconUserSearch />}
            placeholder="Search user"
          />
          <Stack gap={0}>
            {form.values.users.map((user: GroupUserType, index) => (
              <GroupUser
                form={form}
                index={index}
                user={user}
                key={String(user._id)}
                updateUser={updateUser}
              />
            ))}
          </Stack>
        </Paper>
      </Modal>
      <Modal
        opened={newExpenseOpened}
        title="Add Expense"
        onClose={newExpenseHandler.close}
      >
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Description"
              placeholder="Enter a expense description"
              {...eForm.getInputProps("description")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Popover
              opened={opened1}
              onChange={setOpened}
              radius="xl"
              position="bottom-end"
            >
              <Popover.Target>
                <TextInput
                  label="Category"
                  value={eForm.values.category}
                  onClick={() => setOpened((o) => !o)}
                  readOnly
                  styles={{
                    label: { cursor: "pointer" },
                    input: {
                      cursor: "pointer",
                      textTransform: "capitalize",
                    },
                  }}
                  rightSection={
                    <IconSelector style={{ width: rem(16), height: rem(16) }} />
                  }
                />
              </Popover.Target>
              <Popover.Dropdown>
                {/* <Text>Select category - {eForm.values.category}</Text> */}
                <SimpleGrid cols={3}>
                  {expenseCategories.map((category) => (
                    <Stack
                      p={0}
                      key={category.category}
                      align="center"
                      gap={0}
                      onClick={() => setEForm("category", category.category)}
                      style={{ cursor: "pointer" }}
                    >
                      <ThemeIcon
                        variant={
                          isCategory(category.category) ? "filled" : "outline"
                        }
                        color={category.color}
                        radius="xl"
                        size="lg"
                      >
                        <category.icon
                          style={{ height: rem(18), width: rem(18) }}
                        />
                      </ThemeIcon>
                      <Text fz="sm">{category.label}</Text>
                    </Stack>
                  ))}
                </SimpleGrid>
              </Popover.Dropdown>
            </Popover>
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Price"
              placeholder="Enter price"
              leftSection={<IconCurrencyRupee />}
              min={0}
              {...eForm.getInputProps("price")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Popover
              opened={opened2}
              onChange={setOpened2}
              radius="xl"
              position="bottom-end"
              width="auto"
            >
              <Popover.Target>
                <TextInput
                  label="Paid By"
                  value={
                    paidBy.length === 1
                      ? paidBy[0].user === userId
                        ? "You"
                        : users.find(({ user }) => user === paidBy[0].user)
                            ?.name
                      : "Multiple"
                  }
                  onClick={() => setOpened2((o) => !o)}
                  readOnly
                  styles={{
                    label: { cursor: "pointer" },
                    input: { cursor: "pointer" },
                  }}
                  rightSection={
                    <IconSelector style={{ width: rem(16), height: rem(16) }} />
                  }
                />
              </Popover.Target>
              <Popover.Dropdown>
                <SegmentedControl
                  color="red"
                  data={[
                    { value: "single", label: "Single payer" },
                    { value: "multi", label: "Multiple payer" },
                  ]}
                  onChange={(v) => setEForm("isMultiPayer", v === "multi")}
                  value={isMulti}
                  fullWidth
                  size="xs"
                  mb="xs"
                  radius="xl"
                />
                <Group wrap="nowrap" justify="space-between">
                  <Group wrap="nowrap">
                    <Checkbox
                      checked={paidBy.some((item) => item.user === group?.user)}
                      onChange={() => handlePaidByUser(group?.user)}
                      radius="xl"
                    />
                    <Text>
                      {group?.user === userId
                        ? "You"
                        : users.find(({ user }) => user === userId)?.name}
                    </Text>
                  </Group>
                  <NumberInput
                    value={
                      paidBy.some((item) => item.user === group?.user)
                        ? paidBy.find((item) => item.user === group?.user)
                            ?.amount
                        : 0
                    }
                    leftSection={<IconCurrencyRupee />}
                    disabled={!paidBy.some((item) => item.user === group?.user)}
                    onChange={(v) => handlePaidByAmount(group?.user, Number(v))}
                    w="35%"
                  />
                </Group>
                {users.map(({ user, name }) => (
                  <Group wrap="nowrap" key={user} justify="space-between">
                    <Group wrap="nowrap">
                      <Checkbox
                        checked={paidBy.some((item) => item.user === user)}
                        onChange={() => handlePaidByUser(user)}
                        radius="xl"
                      />
                      <Text>{user === userId ? "You" : name}</Text>
                    </Group>
                    <NumberInput
                      leftSection={<IconCurrencyRupee />}
                      value={
                        paidBy.some((item) => item.user === user)
                          ? paidBy.find((item) => item.user === user)?.amount
                          : 0
                      }
                      disabled={!paidBy.some((item) => item.user === user)}
                      onChange={(v) => handlePaidByAmount(user, Number(v))}
                      w="35%"
                    />
                  </Group>
                ))}
                <Group mt="xs" justify="space-between">
                  <Group>
                    <Text ta="right">
                      People : {paidBy.length} / {form.values.users.length + 1}
                    </Text>
                  </Group>
                  <Group wrap="nowrap" gap={0}>
                    {paidTotal > eForm.values.price ? (
                      <>
                        <Text ta="right">Exceeding: &nbsp;</Text>
                        <Text c="red">
                          ₹{Math.abs(paidTotal - eForm.values.price).toFixed(2)}{" "}
                          &nbsp;
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text ta="right">Remaining: &nbsp;</Text>
                        <Text
                          c={paidTotal !== eForm.values.price ? "red" : "green"}
                        >
                          ₹{(eForm.values.price - paidTotal).toFixed(2)} &nbsp;
                        </Text>
                        <Text>/ &nbsp;₹{eForm.values.price}</Text>
                      </>
                    )}
                  </Group>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Grid.Col>
        </Grid>
        <SegmentedControl
          color="teal"
          data={[
            { value: "equally", label: "Equally" },
            { value: "unequally", label: "UnEqually" },
          ]}
          onChange={(v) => setEForm("isEquallySplit", v === "equally")}
          value={isEqually}
          fullWidth
          size="xs"
          my="md"
          radius="xl"
        />
        <ScrollArea w={rem("100%")} mx="auto">
          <Group gap={rem(20)} wrap="nowrap">
            {splitAmong.map((split) => (
              <Paper
                style={{ cursor: "pointer" }}
                miw={rem(100)}
                maw={rem(100)}
                p="xs"
                ta="center"
                shadow="xl"
                bg={split.active ? "teal" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSplitAmongAmount(split.user, 0);
                  handleSplitAmong(split.user);
                }}
                key={String(split.user)}
                withBorder
              >
                <Text fz="xs" truncate>
                  {split.user === userId
                    ? "You"
                    : users.find(({ user }) => user === split.user)?.name}
                </Text>
                {eForm.values.isEquallySplit ? (
                  <NumberFormatter
                    value={split.amount}
                    prefix="₹"
                    thousandsGroupStyle="lakh"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                  />
                ) : (
                  <TextInput
                    disabled={!split.active}
                    value={split.amount}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleSplitAmongAmount(
                        split.user,
                        Number(e.currentTarget.value)
                      )
                    }
                  />
                )}
              </Paper>
            ))}
          </Group>
        </ScrollArea>
        <Group mt="xs" justify="space-between">
          <Group>
            <Text ta="right">
              People : {splitAmong.filter((i) => i.active).length} /{" "}
              {form.values.users.length + 1}
            </Text>
          </Group>
          <Group wrap="nowrap" gap={0}>
            {splitTotal > eForm.values.price ? (
              <>
                <Text ta="right">Exceeding: &nbsp;</Text>
                <Text c="red">
                  ₹{Math.abs(splitTotal - eForm.values.price)} &nbsp;
                </Text>
              </>
            ) : (
              <>
                <Text ta="right">Remaining: &nbsp;</Text>
                <Text c={splitTotal !== eForm.values.price ? "red" : "green"}>
                  ₹{eForm.values.price - splitTotal} &nbsp;
                </Text>
                <Text>/ &nbsp;{eForm.values.price}</Text>
              </>
            )}
          </Group>
        </Group>
        <Button mt="xs" onClick={submitExpense} fullWidth>
          Submit
        </Button>
      </Modal>
    </Container>
  );
};

export default Page;
