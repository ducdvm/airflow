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
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
from __future__ import annotations

from fastapi import HTTPException

from airflow.api_fastapi.common.router import AirflowRouter
from airflow.api_fastapi.core_api.openapi.exceptions import create_openapi_http_exception_doc
from fastapi import status

from airflow.providers.keycloak.auth_manager.api_fastapi.datamodels.security import UserResponse, \
    UserRequest, UserUpdateRequest
from airflow.providers.keycloak.auth_manager.api_fastapi.services.security import KeycloakAuthManagerSecurity

security_router = AirflowRouter(tags=["KeycloakAuthManagerSecurity"])


@security_router.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses=create_openapi_http_exception_doc([status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED, status.HTTP_409_CONFLICT]),
)
def create_user(body: UserRequest) -> UserResponse:
    response = KeycloakAuthManagerSecurity.create_user(body)
    res0, res1 = response

    if isinstance(res0, int): # fail, return error code, error msg
        raise HTTPException(
            status_code=res0,
            detail=res1
        )

    # success, return userid, timestamp
    return UserResponse(
        userid=res0,
        username=body.username,
        email=body.email,
        first_name=body.first_name,
        last_name=body.last_name,
        enabled=body.enabled,
        email_verified=body.email_verified,
        roles=[body.role],
        created_timestamp=res1,
    )

@security_router.get(
    "/users",
    response_model=list[UserResponse],
    status_code=status.HTTP_200_OK,
    responses=create_openapi_http_exception_doc([status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED]),
)
def get_users() -> list[UserResponse]:
    keycloak_users = KeycloakAuthManagerSecurity.list_users_with_roles()
    return [
        UserResponse(
            userid=user.get("id"),
            username=user.get("username"),
            email=user.get("email"),
            first_name=user.get("firstName"),
            last_name=user.get("lastName"),
            enabled=user.get("enabled", True),
            email_verified=user.get("emailVerified"),
            roles=user.get("roles"),
            created_timestamp=user.get("createdTimestamp"),
        )
        for user in keycloak_users
    ]

@security_router.patch(
    "/users/{userid}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    responses=create_openapi_http_exception_doc([status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED, status.HTTP_409_CONFLICT]),
)
def update_user(userid: str, payload: UserUpdateRequest) -> None:
    update_data = payload.model_dump(exclude_unset=True)

    error = KeycloakAuthManagerSecurity.update_user(userid, payload=update_data) # if success, do nothing

    if error is not None: # error
        code, msg = error
        raise HTTPException(
            status_code=code,
            detail=msg
        )

@security_router.delete(
    "/users/{userid}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    responses=create_openapi_http_exception_doc([status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED]),
)
def delete_user(userid: str) -> None:
    return KeycloakAuthManagerSecurity.delete_user(userid)
