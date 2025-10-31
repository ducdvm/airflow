import { Box, Flex, Heading, VStack } from "@chakra-ui/react";

import { UserForm } from "./UserForm.tsx";

export const AddUser = () => {
  return (
    <Box p={8} bg="bg.subtle" flexGrow={1} height="100%">
      <VStack align="stretch">
        <Flex justify="space-between" align="center">
          <Heading as="h2" size="xl" mb="8">
            Add User
          </Heading>
        </Flex>
        <Box>
          <UserForm isEditMode={false}/>
        </Box>
      </VStack>
    </Box>
  );
};
