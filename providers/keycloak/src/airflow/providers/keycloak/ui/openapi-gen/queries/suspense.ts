// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { KeycloakAuthManagerLoginService } from "../requests/services.gen";
import * as Common from "./common";
export const useSimpleAuthManagerLoginServiceCreateTokenAllAdminsSuspense = <TData = Common.SimpleAuthManagerLoginServiceCreateTokenAllAdminsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSimpleAuthManagerLoginServiceCreateTokenAllAdminsKeyFn(queryKey), queryFn: () => KeycloakAuthManagerLoginService.createTokenAllAdmins() as TData, ...options });
export const useSimpleAuthManagerLoginServiceLoginAllAdminsSuspense = <TData = Common.SimpleAuthManagerLoginServiceLoginAllAdminsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSimpleAuthManagerLoginServiceLoginAllAdminsKeyFn(queryKey), queryFn: () => KeycloakAuthManagerLoginService.loginAllAdmins() as TData, ...options });
