import { Box, Button, Collapsible, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import * as React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { LuChevronRight } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";

import { User } from "src/types/user.ts";

type DropdownSectionProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
};

type InfoTuple = [string, string | number | boolean];

type DropdownContentProps = {
  title?: string;
  items: InfoTuple[];
};

function DropdownSection({ isOpen, title, children }: DropdownSectionProps) {
  return (
    <Collapsible.Root defaultOpen={isOpen}>
      <Collapsible.Trigger paddingY="3" display="flex" gap="2" alignItems="center">
        <Collapsible.Indicator transition="transform 0.2s" _open={{ transform: "rotate(90deg)" }}>
          <LuChevronRight />
        </Collapsible.Indicator>
        <Text textStyle="lg">{title}</Text>
      </Collapsible.Trigger>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}

function DropdownContent({ items }: DropdownContentProps) {
  return (
    <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" p={4} width="100%">
      <Grid templateColumns="repeat(4, 1fr)" gap="6">
        {items.map(([label, value]) => (
          <>
            <GridItem colSpan={1}>
              <Text fontWeight="bold">{label}</Text>
            </GridItem>
            <GridItem colSpan={3}>{value}</GridItem>
          </>
        ))}
      </Grid>
    </Box>
  );
}

export const UserInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, firstName, lastName, email, role } = location.state as User;

  return (
    <Box padding="4" borderWidth="1px">
      <Flex direction="column" gap={3}>
        <DropdownSection
          isOpen={true}
          title={"User Info"}
          children={
            <DropdownContent
              items={[
                ["User Name", username],
                ["Is Active?", "True"],
                ["Role", role],
                ["Login count", 17],
              ]}
            />
          }
        />
        <DropdownSection
          isOpen={true}
          title={"Personal Info"}
          children={
            <DropdownContent
              items={[
                ["First Name", firstName],
                ["Last Name", lastName],
                ["Email", email],
              ]}
            />
          }
        />
        <DropdownSection
          isOpen={false}
          title={"Audit Info"}
          children={
            <DropdownContent
              items={[
                ["Last login", "2025-10-16"],
                ["Failed login count", "0"],
                ["Created on", "2025-08-21"],
                ["Created by", "None"],
                ["Changed on", "2025-08-21"],
                ["Changed by", "None"],
              ]}
            />
          }
        />
        <Box gap={2} display="flex">
          <Button size="sm" colorPalette="red" onClick={() => navigate("/users")} type="button">
            <IoMdArrowBack />
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};
