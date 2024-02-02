"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  ExpenseUser,
  GroupType,
  GroupUserType,
} from "@/components/Split/Group/Group.Types";
import SpendingItem from "@/components/Split/Group/Summary/SummarySpendingItem.tsx/SummarySpendingItem";
import GroupUser from "@/components/Split/Group/User/GroupUser";
import { AutoCompleteDataType } from "@/components/Split/Group/User/User.Types";
import { colors, expenseCategories, groupTypes } from "@/lib/constants";
import {
  getCategoryIcon,
  getDigitByString,
  getFormattedDate,
  getInitials,
} from "@/lib/functions";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Center,
  Checkbox,
  Container,
  CopyButton,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
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
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
  rem,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure, useListState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications, showNotification } from "@mantine/notifications";
import {
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconCurrencyRupee,
  IconMinus,
  IconPlus,
  IconReceipt,
  IconSelector,
  IconSettings,
  IconShare,
  IconShareOff,
  IconTrash,
  IconUserPlus,
  IconUserSearch,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import mongoose, { ObjectId } from "mongoose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status, data } = useSession();
  const userId = data?.user?._id || new mongoose.Types.ObjectId();
  const [group, setGroup] = useState<GroupType | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [newExpenseOpened, newExpenseHandler] = useDisclosure(false);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [paids, setPaids] = useState<any[]>([]);
  const [splits, setSplits] = useState<any[]>([]);
  const [opened1, setOpened] = useState(false);
  const [opened2, setOpened2] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [expense, setExpense] = useState<any>(null);
  const [balances, setBalances] = useState<any[]>([]);

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
      date: new Date(),
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
  const [paidBy, paidByHandlers] = useListState<ExpenseUser>([]);
  const [splitAmong, splitAmongHandlers] = useListState<ExpenseUser>([]);
  const splitTotal = splitAmong.reduce(
    (accum, item) => accum + (item?.amount || 0),
    0
  );
  const paidTotal = paidBy.reduce(
    (accum, item) => accum + (item?.amount || 0),
    0
  );
  const price = eForm.values.price || 0;

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
    if (users) {
      splitAmongHandlers.setState(
        users.map(({ user }) => ({
          user,
          amount: user === userId ? price : 0,
          active: true,
        }))
      );
      paidByHandlers.setState([{ user: userId, amount: price || 0 }]);
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
        setExpenses(res.data.expenses);
        setSplits(res.data.splitAmong);
        setPaids(res.data.paidBy);
        setBalances(res.data.balance);
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
      paidByHandlers.setState([{ user, amount: price }]);
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
        amount: price,
      },
    ]);
    // }
  }, [isMulti]);

  useEffect(() => {
    paidByHandlers.apply((item) => ({
      ...item,
      amount: item.user === userId ? eForm?.values?.price || 0 : 0,
    }));
    eForm.setFieldValue("isMultiPayer", false);
    splitAmongHandlers.apply((item) => ({
      user: item.user,
      amount: (eForm?.values?.price || 0) / splitAmong.length,
      active: true,
    }));
  }, [price]);

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
    setLoading.open();
    if (!eForm.values.description) {
      showNotification({
        message: "Description is required field.",
        icon: <IconX />,
        color: "red",
      });
      return;
    }
    if (price < 1) {
      showNotification({
        message: "Price is required field.",
        icon: <IconX />,
        color: "red",
      });
      return;
    }
    if (paidTotal !== price) {
      showNotification({
        message: "Paid by total is not equal to price.",
        icon: <IconX />,
        color: "red",
      });
      setOpened2(true);
      return;
    }
    if (splitTotal !== price) {
      showNotification({
        message: "Split among total is not equal to price.",
        icon: <IconX />,
        color: "red",
      });
      return;
    }
    await axios
      .post(`/api/split/groups/${group?._id}/expenses`, {
        ...eForm.values,
        paidBy,
        splitAmong,
      })
      .then(() => {
        showNotification({
          message: "Succeess",
          icon: <IconCheck />,
          color: "green",
        });
        newExpenseHandler.close();
        eForm.reset();
        getData();
      })
      .catch(() => {
        showNotification({
          message: "Unable to create expense.",
          icon: <IconX />,
          color: "red",
        });
      })
      .finally(() => {
        setLoading.close();
      });
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
  };

  const handleSplitAmongAmount = (
    user: mongoose.Types.ObjectId,
    amount: number
  ) => {
    splitAmongHandlers.applyWhere(
      (item) => item.user === user,
      (item) => ({ ...item, amount })
    );
  };

  const getUserExpense = (expense: string) =>
    paids?.find((item) => item.user === userId && item.expense === expense)
      ?.amount ||
    0 -
      splits?.find((item) => item.user === userId && item.expense === expense)
        ?.amount ||
    0;

  const deleteExpense = () => {
    modals.openConfirmModal({
      title: <Text size="lg">Delete expense forever?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        setLoading.open();
        await axios
          .delete(`/api/split/groups/${group?._id}/expenses?_id=${expense._id}`)
          .catch((error) => {
            notifications.show({
              message: "Unable to delete expense.",
              icon: <IconX />,
              color: "red",
            });
          });
        getExpenses();
        setExpense(null);
        setLoading.close();
      },
    });
  };

  const [loading, setLoading] = useDisclosure(true);
  const getData = () => {
    setLoading.open();
    getGroup();
    getFriends();
    getExpenses();
    setLoading.close();
  };
  useEffect(() => {
    getData();
  }, []);

  const [activeTab, setActiveTab] = useState<string | null>("summary");

  const nonSettlementExpenses = expenses
    .filter(({ isSettelment }) => !isSettelment)
    .map(({ _id }) => String(_id));

  const findIsExist = (expense: any) => nonSettlementExpenses.includes(expense);

  if (status === "loading" || !group || loading) {
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
              <Text fw={700}>{group?.title}</Text>
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
                  {group?.user?._id === userId ? "You" : "Others"}
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
      <Group justify="right">
        <Menu shadow="md" width={150} position="bottom-end">
          <MenuTarget>
            <Button
              leftSection={
                <IconPlus style={{ width: rem(18), height: rem(18) }} />
              }
              rightSection={
                <IconChevronDown style={{ width: rem(18), height: rem(18) }} />
              }
            >
              Add
            </Button>
          </MenuTarget>
          <MenuDropdown>
            <MenuItem
              leftSection={
                <IconReceipt style={{ width: rem(18), height: rem(18) }} />
              }
              onClick={newExpenseHandler.open}
            >
              Expense
            </MenuItem>
            <MenuItem
              leftSection={
                <IconUserPlus style={{ width: rem(18), height: rem(18) }} />
              }
            >
              User
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </Group>
      <Container size="xs" px={0}>
        <Tabs variant="pills" value={activeTab} onChange={setActiveTab}>
          <Paper withBorder>
            <Tabs.List grow>
              <Tabs.Tab value="expense">Expense</Tabs.Tab>
              <Tabs.Tab value="balance">Balance</Tabs.Tab>
              <Tabs.Tab value="summary">Summary</Tabs.Tab>
            </Tabs.List>
          </Paper>
          <Tabs.Panel value="expense">
            <Container size="xs" my="xs" px={0}>
              {expenses.map(
                (expense: {
                  _id: string;
                  category: string;
                  description: string;
                  price: number;
                  date: string;
                }) => (
                  <Paper
                    mt="xs"
                    shadow="xl"
                    p="sm"
                    withBorder
                    onClick={() => setExpense(expense)}
                    key={expense._id}
                  >
                    <Group justify="space-between">
                      <Group>
                        <ThemeIcon radius="xl">
                          {getCategoryIcon(expense.category)}
                        </ThemeIcon>
                        <Stack gap={0}>
                          <Text fz="sm" fw={500}>
                            {expense.description}
                          </Text>
                          <Text fz="xs" fw={200}>
                            {paids.filter(
                              (item) => item.expense === expense._id
                            ).length > 1
                              ? "2 People "
                              : "You "}
                            <NumberFormatter
                              value={paids
                                .filter((item) => item.expense === expense._id)
                                .reduce(
                                  (accum, item) => accum + (item?.amount || 0),
                                  0
                                )}
                              prefix="₹"
                              thousandsGroupStyle="lakh"
                              thousandSeparator=","
                              decimalSeparator="."
                              decimalScale={2}
                            />
                          </Text>
                        </Stack>
                      </Group>
                      <Stack gap={0}>
                        <Badge ta="right" variant="outline" size="xs">
                          {dayjs(expense.date).format("DD-MMM")}
                        </Badge>
                        <Text
                          ta="right"
                          fz="sm"
                          fw={700}
                          c={getUserExpense(expense._id) < 0 ? "red" : "green"}
                        >
                          <NumberFormatter
                            value={getUserExpense(expense._id)}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                            thousandSeparator=","
                            decimalSeparator="."
                            decimalScale={2}
                          />
                        </Text>
                      </Stack>
                    </Group>
                  </Paper>
                )
              )}
            </Container>
          </Tabs.Panel>
          <Tabs.Panel value="balance">
            <Stack mt="md">
              {Object.keys(balances).map((key: string) => {
                const xName = users.find((user) => user.user === key)?.name;
                return (
                  <>
                    {Object.keys(
                      (balances as { [key: string]: any })[key] as string
                    ).map((k) => {
                      const yName = users.find((user) => user.user === k)?.name;
                      const balance = (balances as { [key: string]: any })[key][
                        k
                      ] as number;
                      const sender = balance < 0 ? xName : yName;
                      const receiver = balance < 0 ? yName : xName;
                      return (
                        <>
                          <Paper p="sm" withBorder>
                            <Group
                              wrap="nowrap"
                              gap={0}
                              justify="space-between"
                            >
                              <Stack
                                gap={0}
                                ta="center"
                                align="center"
                                maw={rem(60)}
                              >
                                <Avatar
                                  size="md"
                                  src={null}
                                  alt={sender || ""}
                                  variant="filled"
                                  color={colors[getDigitByString(sender)]}
                                >
                                  {getInitials(sender)}
                                </Avatar>
                                <Text size="xs" fw={700}>
                                  {sender}
                                </Text>
                              </Stack>
                              <ThemeIcon size="xs" variant="transparent">
                                <IconMinus />
                              </ThemeIcon>
                              <Stack gap={0} align="center">
                                <Text
                                  ta="right"
                                  fz="sm"
                                  fw={700}
                                  c={balance < 0 ? "red" : "green"}
                                  size="xs"
                                >
                                  <NumberFormatter
                                    value={balance}
                                    prefix="₹"
                                    thousandsGroupStyle="lakh"
                                    thousandSeparator=","
                                    decimalSeparator="."
                                    decimalScale={2}
                                  />
                                </Text>
                                <Text size="xs">will pay</Text>
                              </Stack>
                              <ThemeIcon size="xs" variant="transparent">
                                <IconArrowRight />
                              </ThemeIcon>
                              <Stack
                                gap={0}
                                ta="center"
                                align="center"
                                maw={rem(60)}
                              >
                                <Avatar
                                  size="md"
                                  src={null}
                                  alt={receiver || ""}
                                  variant="filled"
                                  color={colors[getDigitByString(receiver)]}
                                >
                                  {getInitials(receiver)}
                                </Avatar>
                                <Text size="xs" fw={700}>
                                  {receiver}
                                </Text>
                              </Stack>
                              <Stack gap="xs">
                                <Button
                                  variant="outline"
                                  size="compact-xs"
                                  radius="xl"
                                >
                                  Remind
                                </Button>
                                <Button size="compact-xs" radius="xl">
                                  Settle up
                                </Button>
                              </Stack>
                            </Group>
                          </Paper>
                        </>
                      );
                    })}
                  </>
                );
              })}
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="summary">
            <Text>Summary</Text>
            <Stack gap="xs">
              {users.map((user) => {
                return (
                  <Stack>
                    <SpendingItem
                      data={data}
                      color={colors[getDigitByString(user.name)]}
                      name={user.name}
                      spendings={paids
                        .filter(
                          (paid) =>
                            paid.user === user.user && findIsExist(paid.expense)
                        )
                        .reduce((a, { amount }) => a + amount, 0)}
                      share={splits
                        .filter(
                          (split) =>
                            split.user === user.user &&
                            findIsExist(split.expense)
                        )
                        .reduce((a, { amount }) => a + amount, 0)}
                      paids={
                        paids
                          ?.filter(
                            (paid) =>
                              paid?.user === user.user &&
                              !findIsExist(paid.expense)
                          )
                          ?.reduce((n, { amount }) => n + amount, 0) || 0
                      }
                      received={
                        splits
                          ?.filter(
                            (split) =>
                              split?.user === user.user &&
                              !findIsExist(split.expense)
                          )
                          ?.reduce((n, { amount }) => n + amount, 0) || 0
                      }
                    />
                  </Stack>
                );
              })}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Container>
      <Modal
        opened={opened}
        title="Edit Group"
        onClose={() => {
          close();
          form.reset();
        }}
      >
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
            key: group?.type,
            value: group?.type,
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
        onClose={() => {
          newExpenseHandler.close();
          eForm.reset();
        }}
      >
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Description"
              placeholder="Enter a expense description"
              {...eForm.getInputProps("description")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePickerInput
              label="Date"
              placeholder="Expense date"
              valueFormat="DD MMM YYYY"
              {...eForm.getInputProps("date")}
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
                        {category.icon}
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
                {users.map(({ user, name }) => (
                  <Group wrap="nowrap" key={user} justify="space-between">
                    <Group gap="xs" wrap="nowrap">
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
                      People : {paidBy.length} / {form.values.users.length}
                    </Text>
                  </Group>
                  <Group wrap="nowrap" gap={0}>
                    {paidTotal > price ? (
                      <>
                        <Text ta="right">Exceeding: &nbsp;</Text>
                        <Text c="red">
                          ₹{Math.abs(paidTotal - price).toFixed(2)} &nbsp;
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text ta="right">Remaining: &nbsp;</Text>
                        <Text c={paidTotal !== price ? "red" : "green"}>
                          ₹{(price - paidTotal).toFixed(2)} &nbsp;
                        </Text>
                        <Text>/ &nbsp;₹{price}</Text>
                      </>
                    )}
                  </Group>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Grid.Col>
        </Grid>
        <Text fw={500} size="sm" mt="md">
          Split
        </Text>
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
          mb="md"
          radius="xl"
        />
        <Text fw={500} size="sm" my="xs">
          Split among
        </Text>
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
              {form.values.users.length}
            </Text>
          </Group>
          <Group wrap="nowrap" gap={0}>
            {splitTotal > price ? (
              <>
                <Text ta="right">Exceeding: &nbsp;</Text>
                <Text c="red">₹{Math.abs(splitTotal - price)} &nbsp;</Text>
              </>
            ) : (
              <>
                <Text ta="right">Remaining: &nbsp;</Text>
                <Text c={splitTotal !== price ? "red" : "green"}>
                  ₹{price - splitTotal} &nbsp;
                </Text>
                <Text>/ &nbsp;₹{price}</Text>
              </>
            )}
          </Group>
        </Group>
        <Button mt="xs" onClick={submitExpense} fullWidth>
          Submit
        </Button>
      </Modal>
      <Modal
        opened={Boolean(expense)}
        onClose={() => setExpense(null)}
        withCloseButton={false}
      >
        <Paper mt="xs" shadow="xl" p="sm" withBorder>
          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon radius="xl">
                {getCategoryIcon(expense?.category)}
              </ThemeIcon>
              <Stack gap={0}>
                <Text fz="sm" fw={500}>
                  {expense?.description}
                </Text>
                <Text fz="xs" fw={200}>
                  {getFormattedDate(expense?.date)}
                </Text>
                <Text fz="sm">{expense?.price}</Text>
              </Stack>
            </Group>
            <Stack gap="xs">
              <Badge size="xs" variant="outline">
                {dayjs(group.createdAt).format("DD-MM-YYYY")}
              </Badge>
              <Group justify="right" gap="xs">
                <CopyButton
                  value={`https://www.devloveper.vercel.app/split/groups/${group?._id}`}
                >
                  {({ copied, copy }) => (
                    <ActionIcon
                      color={copied ? "teal" : "blue"}
                      onClick={() => {
                        copy();
                        showNotification({
                          icon: <IconCopy size={16} />,
                          message: "Link copied to clipboard",
                          autoClose: 1000,
                        });
                      }}
                      radius="xl"
                    >
                      {copied ? (
                        <IconShareOff
                          style={{ width: rem(18), height: rem(18) }}
                        />
                      ) : (
                        <IconShare
                          style={{ width: rem(18), height: rem(18) }}
                        />
                      )}
                    </ActionIcon>
                  )}
                </CopyButton>
                <ActionIcon onClick={deleteExpense} color="red" radius="xl">
                  <IconTrash style={{ width: rem(18), height: rem(18) }} />
                </ActionIcon>
              </Group>
            </Stack>
          </Group>
        </Paper>
        <Paper shadow="xl" my="xs" p="sm" withBorder>
          <Text mb="xs" fw={700}>
            Paid By
          </Text>
          <Stack gap={rem(4)}>
            {paids
              ?.filter((paid) => paid?.expense === expense?._id)
              .map((paid) => {
                const name =
                  paid?.user === userId
                    ? data?.user?.name
                    : users.find((user) => paid?.user === user?.user)?.name;
                return (
                  <Group justify="space-between" key={paid?.user}>
                    <Group gap="xs">
                      <Avatar
                        size={rem(20)}
                        src={null}
                        alt={name || ""}
                        variant="filled"
                        color={colors[getDigitByString(name)]}
                      >
                        {getInitials(name)}
                      </Avatar>
                      <Text>{name}</Text>
                    </Group>
                    <NumberFormatter
                      style={{ textAlign: "right" }}
                      value={paid?.amount}
                      prefix="₹"
                      thousandsGroupStyle="lakh"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                    />
                  </Group>
                );
              })}
          </Stack>
          <Divider variant="dashed" my="md" />
          <Text my="xs" fw={700}>
            Split Among
          </Text>
          <Stack gap={rem(4)}>
            {splits
              ?.filter((split) => split?.expense === expense?._id)
              .map((split) => {
                const name =
                  split?.user === userId
                    ? data?.user?.name
                    : users.find((user) => split?.user === user?.user)?.name;
                return (
                  <Group justify="space-between" key={split._id}>
                    <Group gap="xs">
                      <Avatar
                        size={rem(20)}
                        src={null}
                        alt={name || ""}
                        variant="filled"
                        color={colors[getDigitByString(name)]}
                      >
                        {getInitials(name)}
                      </Avatar>
                      <Text>{name}</Text>
                    </Group>
                    <NumberFormatter
                      style={{ textAlign: "right" }}
                      value={split?.amount}
                      prefix="₹"
                      thousandsGroupStyle="lakh"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                    />
                  </Group>
                );
              })}
          </Stack>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Page;
