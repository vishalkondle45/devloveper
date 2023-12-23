import { Paper, Text, ThemeIcon } from "@mantine/core";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  text: string;
  setOpened: (a: boolean) => void;
}

const App = ({ icon, text, setOpened }: Props) => {
  const router = useRouter();
  return (
    <Paper
      style={{ cursor: "pointer" }}
      onClick={() => {
        setOpened(false);
        router.push("/" + text?.toLowerCase());
      }}
      p="xs"
      ta="center"
      bg="transparent"
    >
      <ThemeIcon variant="transparent">{icon}</ThemeIcon>
      <Text>{text}</Text>
    </Paper>
  );
};

export default App;
