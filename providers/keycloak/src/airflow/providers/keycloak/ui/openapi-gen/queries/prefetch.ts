// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type QueryClient } from "@tanstack/react-query";
import { KeycloakAuthManagerLoginService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseSimpleAuthManagerLoginServiceCreateTokenAllAdmins = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSimpleAuthManagerLoginServiceCreateTokenAllAdminsKeyFn(), queryFn: () => KeycloakAuthManagerLoginService.createTokenAllAdmins() });
export const prefetchUseSimpleAuthManagerLoginServiceLoginAllAdmins = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSimpleAuthManagerLoginServiceLoginAllAdminsKeyFn(), queryFn: () => KeycloakAuthManagerLoginService.loginAllAdmins() });
