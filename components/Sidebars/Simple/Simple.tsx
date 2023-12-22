import DevLovePer from "@/components/DevLovePer";
import { Burger, Drawer, Group, rem } from "@mantine/core";
import { SimpleSidebarProps } from "./Simple.types";

const Simple = ({ opened, close }: SimpleSidebarProps) => {
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        size={rem(300)}
        mt={rem(100)}
        withCloseButton={false}
      >
        <Group justify="">
          <Burger opened={opened} onClick={close} />
          <DevLovePer />
        </Group>
      </Drawer>
    </>
  );
};

export default Simple;
