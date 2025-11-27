// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { KeycloakAuthManagerSecurityService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseKeycloakAuthManagerSecurityServiceGetUsers = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseKeycloakAuthManagerSecurityServiceGetUsersKeyFn(), queryFn: () => KeycloakAuthManagerSecurityService.getUsers() });
