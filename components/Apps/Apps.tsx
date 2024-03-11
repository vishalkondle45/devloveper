"use client";
import { ActionIcon, Popover, SimpleGrid } from "@mantine/core";
import {
  IconCircleCheck,
  IconCloudRain,
  IconCoinRupee,
  IconCricket,
  IconFileText,
  IconGridDots,
  IconMessageCircle2,
  IconNote,
  IconRobotFace,
  IconUserCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import App from "./App/App";

const Apps = () => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Popover
        opened={opened}
        onChange={setOpened}
        radius="xl"
        position="bottom-end"
      >
        <Popover.Target>
          <ActionIcon
            onClick={() => setOpened((o) => !o)}
            color="grey"
            variant="outline"
            size="lg"
            radius="xl"
          >
            <IconGridDots size={18} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <SimpleGrid cols={3}>
            <App setOpened={setOpened} icon={<IconNote />} text="Notes" />
            <App
              setOpened={setOpened}
              icon={<IconCircleCheck />}
              text="Todos"
            />
            <App setOpened={setOpened} icon={<IconCoinRupee />} text="Split" />
            <App
              setOpened={setOpened}
              icon={<IconMessageCircle2 />}
              text="Forum"
            />
            <App setOpened={setOpened} icon={<IconRobotFace />} text="Robot" />
            <App setOpened={setOpened} icon={<IconCricket />} text="Scorer" />
            <App
              setOpened={setOpened}
              icon={<IconCloudRain />}
              text="Weather"
            />
            <App setOpened={setOpened} icon={<IconFileText />} text="Blog" />
            <App
              setOpened={setOpened}
              icon={<IconUserCircle />}
              text="Profile"
            />
          </SimpleGrid>
        </Popover.Dropdown>
      </Popover>
    </>
  );
};

export default Apps;
