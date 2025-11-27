// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { KeycloakAuthManagerLoginService, KeycloakAuthManagerSecurityService } from "../requests/services.gen";
export type KeycloakAuthManagerSecurityServiceGetUsersDefaultResponse = Awaited<ReturnType<typeof KeycloakAuthManagerSecurityService.getUsers>>;
export type KeycloakAuthManagerSecurityServiceGetUsersQueryResult<TData = KeycloakAuthManagerSecurityServiceGetUsersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useKeycloakAuthManagerSecurityServiceGetUsersKey = "KeycloakAuthManagerSecurityServiceGetUsers";
export const UseKeycloakAuthManagerSecurityServiceGetUsersKeyFn = (queryKey?: Array<unknown>) => [useKeycloakAuthManagerSecurityServiceGetUsersKey, ...(queryKey ?? [])];
export type KeycloakAuthManagerLoginServiceCreateTokenMutationResult = Awaited<ReturnType<typeof KeycloakAuthManagerLoginService.createToken>>;
export type KeycloakAuthManagerSecurityServiceCreateUserMutationResult = Awaited<ReturnType<typeof KeycloakAuthManagerSecurityService.createUser>>;
export type KeycloakAuthManagerSecurityServiceUpdateUserMutationResult = Awaited<ReturnType<typeof KeycloakAuthManagerSecurityService.updateUser>>;
export type KeycloakAuthManagerSecurityServiceDeleteUserMutationResult = Awaited<ReturnType<typeof KeycloakAuthManagerSecurityService.deleteUser>>;
