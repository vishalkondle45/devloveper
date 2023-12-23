import { Badge, ThemeIcon } from "@mantine/core";
import { IconBraces } from "@tabler/icons-react";
import Link from "next/link";

const DevLovePer = () => {
  return (
    <>
      <Badge
        size="xl"
        p={0}
        style={{ cursor: "pointer" }}
        component={Link}
        href="/"
        variant="transparent"
        leftSection={
          <ThemeIcon>
            <IconBraces size={18} />
          </ThemeIcon>
        }
        styles={{ label: { textTransform: "capitalize" } }}
      >
        DevLovePer
      </Badge>
    </>
  );
};

export default DevLovePer;
