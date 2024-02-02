import { Divider, Paper, Stack, Text, rem } from "@mantine/core";
import SummarySingleItem from "../SummarySingleItem";
import { SummarySpendingItemProps } from "./SummarySpendingItem.Types";

const SpendingItem = ({
  color,
  name,
  spendings,
  share,
  paids,
  received,
  data,
}: SummarySpendingItemProps) => {
  const balance = spendings + paids - (share + received);

  return (
    <Stack gap={0}>
      <Text c={color} fw={500}>
        {name === data?.user?.name ? "You" : name}
      </Text>
      <Paper radius="lg" px="sm" mb="xs" py="xs" withBorder shadow="xl">
        <SummarySingleItem text="Total spends (A)" amount={spendings} />
        <Divider my={rem(4)} variant="dashed" />
        <SummarySingleItem text="Total share (B)" amount={share} />
        <Divider my={rem(4)} variant="dashed" />
        <SummarySingleItem text="Money paid till now (C)" amount={paids} />
        <Divider my={rem(4)} variant="dashed" />
        <SummarySingleItem
          text="Money received till now (D)"
          amount={received}
        />
        <Divider my={rem(4)} variant="dashed" />
        <SummarySingleItem
          color={balance < 0 ? "red" : "green"}
          text="Balance (A+C)-(B+D)"
          amount={balance}
        />
      </Paper>
    </Stack>
  );
};

export default SpendingItem;
