import { Box, Flex, Heading, VStack } from "@chakra-ui/react";

import { UserForm } from "./UserForm.tsx";

export const AddUser = () => {
  return (
    <Box p={5} mt={5} flexGrow={1} height="100%" borderRadius={10} borderWidth={2}>
      <VStack align="stretch">
        <Flex justify="space-between" align="center">
          <Heading as="h2" size="xl" mb="8">
            Add User
          </Heading>
        </Flex>
        <Box>
          <UserForm isEditMode={false} />
        </Box>
      </VStack>
    </Box>
  );
};
