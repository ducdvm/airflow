// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { KeycloakAuthManagerLoginService, KeycloakAuthManagerSecurityService } from "../requests/services.gen";
import { LoginBody, UserRequest, UserUpdateRequest } from "../requests/types.gen";
import * as Common from "./common";
export const useKeycloakAuthManagerSecurityServiceGetUsers = <TData = Common.KeycloakAuthManagerSecurityServiceGetUsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseKeycloakAuthManagerSecurityServiceGetUsersKeyFn(queryKey), queryFn: () => KeycloakAuthManagerSecurityService.getUsers() as TData, ...options });
export const useKeycloakAuthManagerLoginServiceCreateToken = <TData = Common.KeycloakAuthManagerLoginServiceCreateTokenMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: LoginBody;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: LoginBody;
}, TContext>({ mutationFn: ({ requestBody }) => KeycloakAuthManagerLoginService.createToken({ requestBody }) as unknown as Promise<TData>, ...options });
export const useKeycloakAuthManagerSecurityServiceCreateUser = <TData = Common.KeycloakAuthManagerSecurityServiceCreateUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: UserRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: UserRequest;
}, TContext>({ mutationFn: ({ requestBody }) => KeycloakAuthManagerSecurityService.createUser({ requestBody }) as unknown as Promise<TData>, ...options });
export const useKeycloakAuthManagerSecurityServiceUpdateUser = <TData = Common.KeycloakAuthManagerSecurityServiceUpdateUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: UserUpdateRequest;
  userid: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: UserUpdateRequest;
  userid: string;
}, TContext>({ mutationFn: ({ requestBody, userid }) => KeycloakAuthManagerSecurityService.updateUser({ requestBody, userid }) as unknown as Promise<TData>, ...options });
export const useKeycloakAuthManagerSecurityServiceDeleteUser = <TData = Common.KeycloakAuthManagerSecurityServiceDeleteUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  userid: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  userid: string;
}, TContext>({ mutationFn: ({ userid }) => KeycloakAuthManagerSecurityService.deleteUser({ userid }) as unknown as Promise<TData>, ...options });
