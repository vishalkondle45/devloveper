import { Group, NumberFormatter, Text } from "@mantine/core";
import { SummarySingleItemProps } from "./SummarySingleItem.Types";

const SummarySingleItem = ({
  text,
  amount,
  color = "teal",
}: SummarySingleItemProps) => {
  return (
    <Group justify="space-between">
      <Text>{text}</Text>
      <NumberFormatter
        value={amount}
        prefix="₹"
        thousandsGroupStyle="lakh"
        thousandSeparator=","
        decimalSeparator="."
        decimalScale={2}
      />
    </Group>
  );
};

export default SummarySingleItem;
