import { Paper, Text, ThemeIcon } from "@mantine/core";
import { useRouter } from "next/navigation";
import { Props } from "./App.types";

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
      <ThemeIcon size="xl" variant="filled">
        {icon}
      </ThemeIcon>
      <Text>{text}</Text>
    </Paper>
  );
};

export default App;
