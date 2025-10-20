// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { KeycloakAuthManagerLoginService } from "../requests/services.gen";
import { LoginBody } from "../requests/types.gen";
import * as Common from "./common";
export const useSimpleAuthManagerLoginServiceCreateTokenAllAdmins = <TData = Common.SimpleAuthManagerLoginServiceCreateTokenAllAdminsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSimpleAuthManagerLoginServiceCreateTokenAllAdminsKeyFn(queryKey), queryFn: () => KeycloakAuthManagerLoginService.createTokenAllAdmins() as TData, ...options });
export const useSimpleAuthManagerLoginServiceLoginAllAdmins = <TData = Common.SimpleAuthManagerLoginServiceLoginAllAdminsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSimpleAuthManagerLoginServiceLoginAllAdminsKeyFn(queryKey), queryFn: () => KeycloakAuthManagerLoginService.loginAllAdmins() as TData, ...options });
export const useKeycloakAuthManagerLoginServiceCreateToken = <TData = Common.KeycloakAuthManagerLoginServiceCreateTokenMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: LoginBody;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: LoginBody;
}, TContext>({ mutationFn: ({ requestBody }) => KeycloakAuthManagerLoginService.createToken({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSimpleAuthManagerLoginServiceCreateTokenCli = <TData = Common.SimpleAuthManagerLoginServiceCreateTokenCliMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: LoginBody;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: LoginBody;
}, TContext>({ mutationFn: ({ requestBody }) => KeycloakAuthManagerLoginService.createTokenCli({ requestBody }) as unknown as Promise<TData>, ...options });
