import { useState } from "react";

import {
  useKeycloakAuthManagerSecurityServiceCreateUser,
  useKeycloakAuthManagerSecurityServiceDeleteUser,
  useKeycloakAuthManagerSecurityServiceGetUsers,
  useKeycloakAuthManagerSecurityServiceUpdateUser,
} from "../../openapi-gen/queries";
import { UserRequest, UserResponse, UserUpdateRequest } from "../../openapi-gen/requests";

export const useCreateUser = ({ onSuccess }: { onSuccess: (data: UserResponse) => void }) => {
  const [error, setError] = useState<unknown>(undefined);

  const onError = (_error: unknown) => {
    setError(_error);
  };

  const { isPending, mutate } = useKeycloakAuthManagerSecurityServiceCreateUser({
    onError,
    onSuccess,
  });

  const createUser = async (
    variableRequestBody: UserRequest,
  ): Promise<{
    data?: UserResponse;
    errorCode?: number;
    errorMessage?: string;
  }> => {
    return new Promise<{
      data?: UserResponse;
      errorCode?: number;
      errorMessage?: string;
    }>((resolve, reject) => {
      mutate(
        {
          requestBody: {
            username: variableRequestBody.username,
            email: variableRequestBody.email,
            first_name: variableRequestBody.first_name,
            last_name: variableRequestBody.last_name,
            enabled: variableRequestBody.enabled,
            email_verified: variableRequestBody.email_verified,
            role: variableRequestBody.role,
            password: variableRequestBody.password,
          },
        },
        {
          onSuccess: (data) => {
            resolve({ data });
          },
          onError: (err: any) => {
            const backendMessage = err.body.detail;
            reject(new Error(backendMessage));
          },
        },
      );
    });
  };

  return { createUser, error, isPending, setError };
};

export const useGetUsers = () => {
  return useKeycloakAuthManagerSecurityServiceGetUsers<UserResponse[]>();
};

export const useUpdateUser = ({
  onSuccess,
}: {
  onSuccess?: (data: UserResponse) => void;
} = {}) => {
  const [error, setError] = useState<unknown>(undefined);

  const onError = (_error: unknown) => {
    setError(_error);
  };

  const { isPending, mutate, mutateAsync } = useKeycloakAuthManagerSecurityServiceUpdateUser({
    onError,
    onSuccess: (data: UserResponse) => {
      if (onSuccess) {
        onSuccess(data as UserResponse);
      }
    },
  });

  const updateUser = async (
    userid: string,
    userData: UserUpdateRequest,
  ): Promise<{
    data?: UserResponse;
    errorCode?: number;
    errorMessage?: string;
  }> => {
    return new Promise<{
      data?: UserResponse;
      errorCode?: number;
      errorMessage?: string;
    }>((resolve, reject) => {
      mutate(
        {
          userid,
          requestBody: userData,
        },
        {
          onSuccess: (data) => {
            resolve({ data });
          },
          onError: (err: any) => {
            const backendMessage = err.body.detail;
            reject(new Error(backendMessage));
          },
        },
      );
    });
  };

  // Alternative: async/await version
  const updateUserAsync = async (userid: string, userData: UserUpdateRequest): Promise<UserResponse> => {
    try {
      const result = await mutateAsync({
        userid,
        requestBody: userData,
      });
      return result as UserResponse;
    } catch (err) {
      throw err;
    }
  };

  return {
    updateUser,
    updateUserAsync,
    error,
    isPending,
    setError,
  };
};

export const useDeleteUser = ({
  onSuccess,
}: {
  onSuccess?: (userid: string) => void;
} = {}) => {
  const [error, setError] = useState<unknown>(undefined);
  const onError = (_error: unknown) => {
    setError(_error);
  };

  const { mutateAsync } = useKeycloakAuthManagerSecurityServiceDeleteUser({
    onError,
    onSuccess: (_data, variables) => {
      if (onSuccess) {
        onSuccess(variables.userid);
      }
    },
  });

  const deleteUser = async (userid: string): Promise<void> => {
    try {
      await mutateAsync({ userid });
    } catch (err) {
      throw err;
    }
  };

  return {
    deleteUser,
    error,
    setError,
  };
};
