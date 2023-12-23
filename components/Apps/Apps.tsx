"use client";
import { ActionIcon, Popover, SimpleGrid } from "@mantine/core";
import {
  IconCalendar,
  IconCircleCheck,
  IconCloudRain,
  IconCoinRupee,
  IconFileText,
  IconGridDots,
  IconMessageCircle2,
  IconMusic,
  IconNote,
  IconUserCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import App from "./App/App";

const Apps = () => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Popover opened={opened} onChange={setOpened}>
        <Popover.Target>
          <ActionIcon
            onClick={() => setOpened((o) => !o)}
            color="gray"
            variant="outline"
            size="lg"
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
              icon={<IconCalendar />}
              text="Calendar"
            />
            <App
              setOpened={setOpened}
              icon={<IconCloudRain />}
              text="Weather"
            />
            <App setOpened={setOpened} icon={<IconMusic />} text="Music" />
            <App setOpened={setOpened} icon={<IconFileText />} text="Blog" />
            <App
              setOpened={setOpened}
              icon={<IconMessageCircle2 />}
              text="Forum"
            />
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
