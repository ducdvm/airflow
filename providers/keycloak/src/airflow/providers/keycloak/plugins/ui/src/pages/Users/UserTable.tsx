import {
  ActionBar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  createListCollection,
  Flex,
  Heading,
  IconButton,
  Pagination,
  Portal,
  Select,
  Table,
  TableCell,
  TableRow,
  TableScrollArea,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuSearch, LuSquarePen, LuDelete } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { User } from "src/types/user.ts";

const size = createListCollection({
  items: [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
  ],
});

export const UserTable = () => {
  const [selection, setSelection] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const navigate = useNavigate();

  const pageCount = Math.max(1, Math.ceil(users.length / pageSize));

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < users.length;

  const visibleItems = users.slice((page - 1) * pageSize, page * pageSize);

  const onDeleteUser = () => {
    if (selection.length === 0) {
      console.warn("No user selected for deletion.");
      return;
    }
    console.log("delete user");
  };

  const onAddUser = () => {
    navigate("/users/add");
  };

  const onEditUser = (user: User) => {
    navigate("/users/edit", { state: user });
  };

  const rows = visibleItems.map((item) => (
    <Table.Row key={item.username} data-selected={selection.includes(item.username) ? "" : undefined}>
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(item.username)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.username]
                : prev.filter((username) => username !== item.username),
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{item.username}</Table.Cell>
      <Table.Cell>{item.email}</Table.Cell>
      <Table.Cell>{item.lastName}</Table.Cell>
      <Table.Cell>{item.firstName}</Table.Cell>
      <Table.Cell>{item.role}</Table.Cell>
      <Table.Cell maxWidth="12">
        <Flex justify="center" align="center" gap={4}>
          <IconButton
            aria-label="View info"
            size="2xs"
            variant="surface"
            colorPalette="blue"
            onClick={() => navigate(`/users/${item.username}`, { state: item })}
          >
            <LuSearch />
          </IconButton>
          <IconButton
            aria-label="Edit user"
            size="2xs"
            variant="surface"
            colorPalette="blue"
            onClick={() => {
              onEditUser({ ...item, password: "" });
            }}
          >
            <LuSquarePen />
          </IconButton>
        </Flex>
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <>
      <Flex align="center" justify="space-between" w="full" mb={4}>
        <Heading as="h3" size="xl">
          Users List
        </Heading>
        <Button size="sm" colorPalette="brand" onClick={() => onAddUser?.()}>
          Create
        </Button>
      </Flex>

      {/*table*/}
      <TableScrollArea w="full" borderWidth="1px" rounded="md" maxH="62vh">
        <Table.Root interactive stickyHeader>
          {/*header*/}
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="7">
                <Checkbox.Root
                  size="sm"
                  top="0.5"
                  aria-label="Select all rows"
                  checked={indeterminate ? "indeterminate" : selection.length > 0}
                  onCheckedChange={(changes) => {
                    setSelection(changes.checked ? users.map((item) => item.username) : []);
                  }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Username</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Email</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Last name</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>First name</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <strong>Role</strong>
              </Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          {/*body*/}
          <Table.Body>{rows}</Table.Body>

          {/*footer*/}
          <Table.Footer>
            <TableRow position="sticky" bottom={0} zIndex={1} bg="bg.subtle" borderTopWidth={1}>
              <TableCell colSpan={7} bg="transparent" borderTopWidth={0}>
                <Flex justify="flex-end" align="center" px={4} py={2} gap={4}>
                  <Box px={4}>Select page size</Box>

                  <Select.Root
                    size="sm"
                    width="240px"
                    collection={size}
                    defaultValue={[pageSize.toString()]}
                    onValueChange={(details) => {
                      const newSize = parseInt(details.value[0], 10);
                      setPageSize(newSize);
                      setPage(1);
                    }}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select size" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {size.items.map((framework: any) => (
                            <Select.Item item={framework} key={framework.value}>
                              {framework.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>

                  <Heading as="h4" size="sm" textAlign="right" color="fg.muted">
                    Record Count:
                    <Box as="span" ml={2}>
                      {users.length} records
                    </Box>
                  </Heading>
                </Flex>
              </TableCell>
            </TableRow>
          </Table.Footer>
        </Table.Root>
      </TableScrollArea>

      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>{selection.length} selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm" onClick={onDeleteUser}>
                Delete <LuDelete />
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>

      <Pagination.Root
        count={users.length}
        pageSize={pageSize}
        page={page}
        onPageChange={(details) => setPage(details.page)}
      >
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton disabled={page <= 1}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(pageItem) => (
              <IconButton
                key={pageItem.value}
                variant={{ base: "ghost", _selected: "solid" }}
                colorPalette={"brand"}
              >
                {pageItem.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton disabled={page >= pageCount}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </>
  );
};

const users = [
  { username: "admin", email: "admin@example.com", lastName: "Airflow", firstName: "Admin", role: "Admin" },
  { username: "user", email: "admin@example.com", lastName: "Airflow", firstName: "User", role: "User" },
  {
    username: "userone",
    email: "admin@example.com",
    lastName: "Airflow",
    firstName: "UserOne",
    role: "User",
  },
  {
    username: "userviewer",
    email: "admin@example.com",
    lastName: "Airflow",
    firstName: "Viewer",
    role: "Viewer",
  },
  { username: "userop", email: "admin@example.com", lastName: "Airflow", firstName: "Op", role: "Op" },
  { username: "johndoe", email: "johndoe@example.com", lastName: "Doe", firstName: "John", role: "User" },
  { username: "janedoe", email: "janedoe@example.com", lastName: "Doe", firstName: "Jane", role: "Admin" },
  {
    username: "bobsmith",
    email: "bobsmith@example.com",
    lastName: "Smith",
    firstName: "Bob",
    role: "Viewer",
  },
  { username: "alicejones", email: "alice@example.com", lastName: "Jones", firstName: "Alice", role: "Op" },
  { username: "mikebrown", email: "mike@example.com", lastName: "Brown", firstName: "Mike", role: "User" },
  {
    username: "sarahwilson",
    email: "sarah@example.com",
    lastName: "Wilson",
    firstName: "Sarah",
    role: "Admin",
  },
  { username: "tomclark", email: "tom@example.com", lastName: "Clark", firstName: "Tom", role: "Viewer" },
  { username: "emmadavis", email: "emma@example.com", lastName: "Davis", firstName: "Emma", role: "User" },
  {
    username: "chrismiller",
    email: "chris@example.com",
    lastName: "Miller",
    firstName: "Chris",
    role: "Op",
  },
  {
    username: "peterwhite",
    email: "peter@example.com",
    lastName: "White",
    firstName: "Peter",
    role: "User",
  },
  { username: "lucygreen", email: "lucy@example.com", lastName: "Green", firstName: "Lucy", role: "Admin" },
  {
    username: "markthomas",
    email: "mark@example.com",
    lastName: "Thomas",
    firstName: "Mark",
    role: "Viewer",
  },
  { username: "annawright", email: "anna@example.com", lastName: "Wright", firstName: "Anna", role: "Op" },
  { username: "jamesking", email: "james@example.com", lastName: "King", firstName: "James", role: "User" },
  {
    username: "oliviahill",
    email: "olivia@example.com",
    lastName: "Hill",
    firstName: "Olivia",
    role: "Admin",
  },
  {
    username: "williamtaylor",
    email: "william@example.com",
    lastName: "Taylor",
    firstName: "William",
    role: "Viewer",
  },
  {
    username: "sophiabaker",
    email: "sophia@example.com",
    lastName: "Baker",
    firstName: "Sophia",
    role: "Op",
  },
  {
    username: "henrymorris",
    email: "henry@example.com",
    lastName: "Morris",
    firstName: "Henry",
    role: "User",
  },
  {
    username: "isabellaross",
    email: "isabella@example.com",
    lastName: "Ross",
    firstName: "Isabella",
    role: "Admin",
  },
  {
    username: "danielwood",
    email: "daniel@example.com",
    lastName: "Wood",
    firstName: "Daniel",
    role: "Viewer",
  },
  { username: "avacooper", email: "ava@example.com", lastName: "Cooper", firstName: "Ava", role: "User" },
  {
    username: "jacksonhall",
    email: "jackson@example.com",
    lastName: "Hall",
    firstName: "Jackson",
    role: "Op",
  },
  { username: "miabutler", email: "mia@example.com", lastName: "Butler", firstName: "Mia", role: "Admin" },
  { username: "davidlee", email: "david@example.com", lastName: "Lee", firstName: "David", role: "User" },
];
