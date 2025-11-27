import { QueryClient } from "@tanstack/react-query";

import { OpenAPI } from "../openapi-gen/requests";

// Dynamically set the base URL for XHR requests based on the meta tag.
OpenAPI.BASE = document.querySelector("head>base")?.getAttribute("href") ?? "";
if (OpenAPI.BASE.endsWith("/")) {
  OpenAPI.BASE = OpenAPI.BASE.slice(0, -1);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
      retryDelay: 500,
    },
  },
});
