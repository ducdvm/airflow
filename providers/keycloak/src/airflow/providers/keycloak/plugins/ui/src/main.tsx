import { ChakraProvider } from "@chakra-ui/react";
import { FC } from "react";
import { RouterProvider } from "react-router-dom";

import { ColorModeProvider } from "src/context/colorMode";
import { router } from "src/router.tsx";

import { system } from "./theme";

export interface PluginComponentProps {
  // Add any props your plugin component needs
}

/**
 * Main plugin component
 */
const PluginComponent: FC<PluginComponentProps> = (props) => {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <RouterProvider router={router} />
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default PluginComponent;
