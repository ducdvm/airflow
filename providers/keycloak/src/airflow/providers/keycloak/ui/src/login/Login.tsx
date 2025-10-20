/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import type { LoginResponse } from "openapi-gen/requests/types.gen";
import { useCookies } from "react-cookie";
import { useSearchParams } from "react-router-dom";



import { AirflowPin } from "src/AirflowPin";
import { ErrorAlert } from "src/alert/ErrorAlert";
import { LoginForm } from "src/login/LoginForm";
import { useCreateToken } from "src/queries/useCreateToken";


export type LoginBody = {
  password: string;
  username: string;
};

const isSafeUrl = (targetUrl: string): boolean => {
  try {
    const base = new URL(globalThis.location.origin);
    const target = new URL(targetUrl, base);

    return (target.protocol === "http:" || target.protocol === "https:") && target.origin === base.origin;
  } catch {
    return false;
  }
};

export const Login = () => {
  const [searchParams] = useSearchParams();
  const [, setCookie] = useCookies(["_token"]);

  const onSuccess = (data: LoginResponse) => {
    // Fallback similar to FabAuthManager, strip off the next
    const fallback = "/";

    // Redirect to appropriate page with the token
    const next = searchParams.get("next") ?? fallback;

    setCookie("_token", data.access_token, {
      path: "/",
      secure: globalThis.location.protocol !== "http:",
    });

    const redirectTarget = isSafeUrl(next) ? next : fallback;

    globalThis.location.replace(redirectTarget);
  };
  const { createToken, error, isPending, setError } = useCreateToken({
    onSuccess,
  });

  const onLogin = (data: LoginBody) => {
    setError(undefined);
    createToken(data);
  };

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container
        border="1px"
        borderColor="gray.emphasized"
        borderRadius={5}
        borderStyle="solid"
        borderWidth="1px"
        maxW="2xl"
        mt={2}
        p="4"
      >
        <Flex gap={2} mb={6}>
          <AirflowPin height="35px" width="35px" />
          <Heading colorPalette="blue" fontWeight="normal" size="xl">
            Sign into Airflow
          </Heading>
        </Flex>

        {Boolean(error) && <ErrorAlert error={error} />}

        <Text mb={4}>Enter your username and password below:</Text>
        <LoginForm isPending={isPending} onLogin={onLogin} />
      </Container>
    </Flex>
  );
};
