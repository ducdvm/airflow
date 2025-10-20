// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseQueryResult } from "@tanstack/react-query";
import { KeycloakAuthManagerLoginService } from "../requests/services.gen";
export type SimpleAuthManagerLoginServiceCreateTokenAllAdminsDefaultResponse = Awaited<ReturnType<typeof KeycloakAuthManagerLoginService.createTokenAllAdmins>>;
export type SimpleAuthManagerLoginServiceCreateTokenAllAdminsQueryResult<TData = SimpleAuthManagerLoginServiceCreateTokenAllAdminsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSimpleAuthManagerLoginServiceCreateTokenAllAdminsKey = "SimpleAuthManagerLoginServiceCreateTokenAllAdmins";
export const UseSimpleAuthManagerLoginServiceCreateTokenAllAdminsKeyFn = (queryKey?: Array<unknown>) => [useSimpleAuthManagerLoginServiceCreateTokenAllAdminsKey, ...(queryKey ?? [])];
export type SimpleAuthManagerLoginServiceLoginAllAdminsDefaultResponse = Awaited<ReturnType<typeof KeycloakAuthManagerLoginService.loginAllAdmins>>;
export type SimpleAuthManagerLoginServiceLoginAllAdminsQueryResult<TData = SimpleAuthManagerLoginServiceLoginAllAdminsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSimpleAuthManagerLoginServiceLoginAllAdminsKey = "SimpleAuthManagerLoginServiceLoginAllAdmins";
export const UseSimpleAuthManagerLoginServiceLoginAllAdminsKeyFn = (queryKey?: Array<unknown>) => [useSimpleAuthManagerLoginServiceLoginAllAdminsKey, ...(queryKey ?? [])];
export type KeycloakAuthManagerLoginServiceCreateTokenMutationResult = Awaited<ReturnType<typeof KeycloakAuthManagerLoginService.createToken>>;
export type SimpleAuthManagerLoginServiceCreateTokenCliMutationResult = Awaited<ReturnType<typeof KeycloakAuthManagerLoginService.createTokenCli>>;
