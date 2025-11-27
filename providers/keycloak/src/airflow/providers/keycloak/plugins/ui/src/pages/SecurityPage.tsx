import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { NavButtons } from "src/components/ui/nav.tsx";

export const SecurityPage = () => {
  return (
    <Box
      minH="100vh"
      overflow="auto" // allows scrollbars
      display="flex"
      flexDirection="column"
    >
      <Flex p={8} flexGrow={1} height="100%" direction={"column"}>
        <Flex justify={"flex-start"} gap={4}>
          <NavButtons />
        </Flex>

        <Outlet />
      </Flex>
    </Box>
  );
};
