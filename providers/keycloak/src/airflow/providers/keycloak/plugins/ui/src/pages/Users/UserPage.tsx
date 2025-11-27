import { Box, VStack } from "@chakra-ui/react";

import { UserTable } from "./UserTable";

export const UserPage = () => {
  return (
    <Box p={5} mt={5} flexGrow={1} height="100%" borderRadius={10} borderWidth={2}>
      <VStack>
        <UserTable />
      </VStack>
    </Box>
  );
};
