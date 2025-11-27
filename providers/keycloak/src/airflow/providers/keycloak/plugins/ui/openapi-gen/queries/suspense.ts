// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { KeycloakAuthManagerSecurityService } from "../requests/services.gen";
import * as Common from "./common";
export const useKeycloakAuthManagerSecurityServiceGetUsersSuspense = <TData = Common.KeycloakAuthManagerSecurityServiceGetUsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseKeycloakAuthManagerSecurityServiceGetUsersKeyFn(queryKey), queryFn: () => KeycloakAuthManagerSecurityService.getUsers() as TData, ...options });
