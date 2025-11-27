import { HStack, Button, IconButton, Menu, Portal, useBreakpointValue } from "@chakra-ui/react";
import { LuMenu as MenuIcon } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";

export function NavButtons() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Users", path: "/users" },
    { label: "Roles", path: "/roles" },
    { label: "Permissions", path: "/permissions" },
  ];

  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label="Navigation menu" variant="outline" size="sm">
            <MenuIcon />
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Menu.Item
                    key={item.path}
                    value={item.path}
                    onClick={() => navigate(item.path)}
                    fontWeight={isActive ? "bold" : "normal"}
                  >
                    {item.label}
                  </Menu.Item>
                );
              })}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    );
  }

  return (
    <HStack gap={4}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? "solid" : "outline"}
            size="md"
            colorPalette="teal"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        );
      })}
    </HStack>
  );
}
