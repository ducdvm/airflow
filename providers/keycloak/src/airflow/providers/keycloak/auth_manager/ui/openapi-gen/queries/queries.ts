// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { KeycloakAuthManagerLoginService } from "../requests/services.gen";
import { LoginBody } from "../requests/types.gen";
import * as Common from "./common";
export const useKeycloakAuthManagerLoginServiceCreateToken = <TData = Common.KeycloakAuthManagerLoginServiceCreateTokenMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: LoginBody;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: LoginBody;
}, TContext>({ mutationFn: ({ requestBody }) => KeycloakAuthManagerLoginService.createToken({ requestBody }) as unknown as Promise<TData>, ...options });
