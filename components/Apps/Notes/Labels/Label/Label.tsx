import { Badge, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { Props } from "./Label.types";

const Label = ({ labels, label, updateLabel }: Props) => {
  const { hovered, ref } = useHover();
  return (
    <Badge
      // size="lg"
      variant="dot"
      rightSection={
        hovered && (
          <IconX
            style={{ width: rem(16), height: rem(16) }}
            onClick={() => updateLabel(label)}
          />
        )
      }
      ref={ref}
    >
      {labels?.find((item) => item?._id === label)?.title}
    </Badge>
  );
};

export default Label;
