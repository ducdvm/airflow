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
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuDelete, LuSearch, LuSquarePen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Toaster, toaster } from "src/components/ui/toaster.tsx";
import { useDeleteUser, useGetUsers } from "src/queries/users.ts";
import { User } from "src/types/user.ts";

import { useKeycloakAuthManagerSecurityServiceGetUsersKey } from "../../../openapi-gen/queries";

type UserRow = Omit<User, "password" | "createdAt">;

const size = createListCollection({
  items: [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
  ],
});

export const UserTable = () => {
  const { data: users } = useGetUsers();
  const [selection, setSelection] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const rowData = useMemo<UserRow[]>(
    () =>
      users?.map((user) => ({
        userid: user.userid!,
        username: user.username,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        emailVerified: user.email_verified || false,
        role: user.roles?.[0] || "No Role",
        createdTimeStamp: user.created_timestamp || 0,
      })) ?? [],
    [users],
  );

  const adminRows = rowData.filter((row) => row.role !== "Admin");
  const [pageSize, setPageSize] = useState<number>(5);
  const navigate = useNavigate();

  const pageCount = Math.max(1, Math.ceil(rowData.length / pageSize));

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length + adminRows.length < rowData.length;

  const visibleItems = rowData.slice((page - 1) * pageSize, page * pageSize);

  const { deleteUser } = useDeleteUser({
    onSuccess: (userid) => {
      console.log("User deleted:", userid);
    },
  });

  const onDeleteUser = async () => {
    if (selection.length === 0) {
      console.warn("No user selected for deletion.");
      return;
    }
    console.log("delete user", selection);

    const usernames = selection
      .map((id) => rowData.find((user) => user.userid === id)?.username)
      .filter(Boolean)
      .join(", ");

    const confirmMessage =
      selection.length === 1
        ? `Are you sure you want to delete user "${usernames}"?`
        : `Are you sure you want to delete ${selection.length} users (${usernames})?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const deleteAllPromise = Promise.all(selection.map((userid) => deleteUser(userid)));

      toaster.promise(deleteAllPromise, {
        success: {
          title: "Successfully deleted!",
          description: `${selection.length} user(s) have been deleted successfully.`,
          duration: 2000,
        },
        error: {
          title: "Delete failed",
          description: "Some users could not be deleted.",
        },
        loading: {
          title: "Deleting users...",
          description: `Deleting ${selection.length} user(s), please wait`,
        },
      });

      await deleteAllPromise;

      await queryClient.invalidateQueries({
        queryKey: [useKeycloakAuthManagerSecurityServiceGetUsersKey],
      });

      setSelection([]);
    } catch (err) {
      console.error("Bulk delete error:", err);
    }
  };

  const onAddUser = () => {
    navigate("/users/add");
  };

  const onEditUser = (user: UserRow) => {
    navigate(`/users/${user.userid}/edit`, { state: user });
  };

  const rows = visibleItems.map((item: UserRow) => (
    <Table.Row key={item.userid} data-selected={selection.includes(item.userid) ? "" : undefined}>
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(item.userid)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked ? [...prev, item.userid] : prev.filter((userid) => userid !== item.userid),
            );
          }}
          disabled={item.role === "Admin"}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{item.username}</Table.Cell>
      <Table.Cell maxWidth="24">{item.email}</Table.Cell>
      <Table.Cell>{item.emailVerified ? "Yes" : "No"}</Table.Cell>
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
            onClick={() => navigate(`/users/${item.userid}/info`, { state: item })}
          >
            <LuSearch />
          </IconButton>
          <IconButton
            aria-label="Edit user"
            size="2xs"
            variant="surface"
            colorPalette="blue"
            onClick={() => {
              onEditUser(item);
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
          Users
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
                    setSelection(changes.checked ? adminRows.map((item) => item.userid) : []);
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
                <strong>Verified?</strong>
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
            <TableRow position="sticky" bottom={0} zIndex={1} borderTopWidth={1}>
              <TableCell colSpan={7} bg="transparent" borderTopWidth={0}>
                <Flex justify="flex-end" align="center" px={4} py={2} gap={4}>
                  <Box px={4}>Select page size</Box>

                  <Select.Root
                    size="sm"
                    width="240px"
                    collection={size}
                    defaultValue={[rowData.length.toString()]}
                    onValueChange={(details) => {
                      const newSize = parseInt(details.value[0] ?? pageSize.toString(), 10);
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
                    Record Count: {rowData.length} records
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
              <Button variant="outline" colorPalette={"red"} size="sm" onClick={onDeleteUser}>
                Delete <LuDelete />
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>

      <Pagination.Root
        count={rowData.length}
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

      <Toaster />
    </>
  );
};
