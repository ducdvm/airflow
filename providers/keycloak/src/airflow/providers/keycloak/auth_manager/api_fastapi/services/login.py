#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,fab
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

from __future__ import annotations

from typing import TYPE_CHECKING, cast

from starlette import status
from starlette.exceptions import HTTPException

from airflow.providers.keycloak.auth_manager.api_fastapi.datamodels.login import LoginBody, LoginResponse
from airflow.api_fastapi.app import get_auth_manager
from airflow.configuration import conf

if TYPE_CHECKING:
    from airflow.providers.keycloak.auth_manager.keycloak_auth_manager import KeycloakAuthManager
else:
    from keycloak.exceptions import KeycloakAuthenticationError


class KeycloakAuthManagerLogin:
    """Login Service for KeycloakAuthManager.
    Creates an access token based on user credentials (username, password).
    """

    @classmethod
    def create_token(
        cls, body: LoginBody, expiration_time_in_seconds: int = conf.getint("api_auth", "jwt_expiration_time")
    ) -> str:
        if not body.username or not body.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username and password must be provided"
            )

        auth_manager = cast("KeycloakAuthManager", get_auth_manager())

        token_info = cls._get_keycloak_access_token(body.username, body.password)

        user_info = {
            "sub": token_info.get("sub", ""),
            "email_verified": token_info.get("email_verified", False),
            "name": token_info.get("name", ""),
            "email": token_info.get("email", ""),
            "roles": token_info.get("resource_access", {}).get("airflow-client", {}).get("roles", []),
        }

        user = auth_manager.deserialize_user(user_info)

        return auth_manager.generate_jwt(
            user=user, expiration_time_in_seconds=expiration_time_in_seconds
        )

    @staticmethod
    def _get_keycloak_access_token(username: str, password: str) -> dict:
        from keycloak import KeycloakOpenID

        keycloak_openid = KeycloakOpenID(
            server_url=conf.get("keycloak_auth_manager", "server_url"),
            realm_name=conf.get("keycloak_auth_manager", "realm"),
            client_id=conf.get("keycloak_auth_manager", "client_id"),
            client_secret_key=conf.get("keycloak_auth_manager", "client_secret")
        )

        try:
            token = keycloak_openid.token(username, password)
            token_info = keycloak_openid.decode_token(token['access_token'])
        except KeycloakAuthenticationError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=f"Unexpected error: {e}")

        return token_info
