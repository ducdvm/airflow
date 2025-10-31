import { Box, Button, VStack } from "@chakra-ui/react";

import { useColorMode } from "src/context/colorMode";

import { UserTable } from "./UserTable";

export const UserPage = () => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Box p={8} bg="bg.subtle" flexGrow={1} height="100%">
      <VStack>
        <UserTable />
        <Button onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")} colorPalette="brand">
          Toggle Theme
        </Button>
      </VStack>
    </Box>
  );
};
