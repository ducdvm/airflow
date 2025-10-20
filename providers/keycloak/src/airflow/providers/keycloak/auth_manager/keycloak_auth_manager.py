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
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

from pathlib import Path
from typing import Any

from airflow.api_fastapi.app import AUTH_MANAGER_FASTAPI_APP_PREFIX
from airflow.api_fastapi.auth.managers.base_auth_manager import BaseAuthManager, ResourceMethod
from airflow.api_fastapi.auth.managers.models.resource_details import AccessView, VariableDetails, \
    PoolDetails, AssetAliasDetails, AssetDetails, BackfillDetails, DagAccessEntity, DagDetails, \
    ConnectionDetails, ConfigurationDetails
from airflow.api_fastapi.common.types import ExtraMenuItem, MenuItem
from airflow.cli.cli_config import CLICommand
from airflow.exceptions import AirflowException
from airflow.security import permissions
from airflow.security.permissions import RESOURCE_DAG, RESOURCE_DAG_RUN, RESOURCE_ASSET, RESOURCE_CONFIG, \
    RESOURCE_CONNECTION, RESOURCE_BACKFILL, RESOURCE_ASSET_ALIAS, RESOURCE_POOL, RESOURCE_VARIABLE
from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import HTMLResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from airflow.providers.keycloak.auth_manager.api_fastapi.models import KeycloakUser
from .config import get_kc_action_from_method_map, get_map_kc_role_to_permission, \
    get_map_dag_access_entity_to_resource_type, get_map_access_view_to_resource_type
from .config import get_map_menu_item_to_keycloak_resource_type


class KeycloakAuthManager(BaseAuthManager[KeycloakUser]):
    """
    Airflow Auth Manager in integration with Keycloak.
    """

    def deserialize_user(self, token: dict[str, Any]) -> KeycloakUser:
        return KeycloakUser(
            id=token.get("sub"),
            email_verified=token.get("email_verified", False),
            name=token.get("name", ""),
            email=token.get("email", ""),
            roles=token.get("roles", []),
        )

    def serialize_user(self, user: KeycloakUser) -> dict[str, Any]:
        return {
            "sub": user.get_id(),
            "email_verified":user.email_verified,
            "name": user.get_name(),
            "email": user.email,
            "roles": user.roles
        }

    def get_url_login(self, **kwargs) -> str:
        """Return the login page URL."""
        return AUTH_MANAGER_FASTAPI_APP_PREFIX + "/login"

    def is_authorized_configuration(self, *, method: ResourceMethod, user: KeycloakUser,
                                    details: ConfigurationDetails | None = None) -> bool:
        return self._is_authorized(method=method, resource_type=RESOURCE_CONFIG, user=user)

    def is_authorized_connection(self, *, method: ResourceMethod, user: KeycloakUser,
                                 details: ConnectionDetails | None = None) -> bool:
        return self._is_authorized(method=method, resource_type=RESOURCE_CONNECTION, user=user)

    def is_authorized_dag(self, *, method: ResourceMethod, user: KeycloakUser,
                          access_entity: DagAccessEntity | None = None,
                          details: DagDetails | None = None) -> bool:
        """
        Return whether the user is authorized to access the dag.

        There are multiple scenarios:

        1. ``dag_access`` is not provided which means the user wants to access the DAG itself and not a sub
        entity (e.g. DAG runs).
        2. ``dag_access`` is provided which means the user wants to access a sub entity of the DAG
        (e.g. DAG runs).

            a. If ``method`` is GET, then check the user has READ permissions on the DAG and the sub entity.
            b. Else, check the user has EDIT permissions on the DAG and ``method`` on the sub entity. However,
                if no specific DAG is targeted, just check the sub entity.

        :param method: The method to authorize.
        :param user: The user performing the action.
        :param access_entity: The dag access entity.
        :param details: The dag details.
        """

        if not access_entity:
            # Scenario 1
            return self._is_authorized_dag_details(method=method, details=details, user=user)

        # Scenario 2
        resource_types = self._get_resource_types(access_entity)
        dag_method: ResourceMethod = "GET" if method == "GET" else "PUT"

        if (details and details.id) and not self._is_authorized_dag_details(
            method=dag_method, details=details, user=user
        ):
            return False

        return all(
            (
                self._is_authorized(method=method, resource_type=resource_type, user=user)
                if resource_type != RESOURCE_DAG_RUN or not hasattr(permissions, "resource_name")
                else self._is_authorized_dag_run(method=method, details=details, user=user)
            )
            for resource_type in resource_types
        )

    def is_authorized_backfill(self, *, method: ResourceMethod, user: KeycloakUser,
                               details: BackfillDetails | None = None) -> bool:
        return self._is_authorized(method=method, resource_type=RESOURCE_BACKFILL, user=user)

    def is_authorized_asset(self, *, method: ResourceMethod, user: KeycloakUser,
                            details: AssetDetails | None = None) -> bool:
        return self._is_authorized(method=method, resource_type=RESOURCE_ASSET, user=user)

    def is_authorized_asset_alias(self, *, method: ResourceMethod, user: KeycloakUser,
                                  details: AssetAliasDetails | None = None) -> bool:
        return self._is_authorized(method=method, resource_type=RESOURCE_ASSET_ALIAS, user=user)

    def is_authorized_pool(self, *, method: ResourceMethod, user: KeycloakUser,
                           details: PoolDetails | None = None) -> bool:
        return self._is_authorized(method=method, resource_type=RESOURCE_POOL, user=user)

    def is_authorized_variable(self, *, method: ResourceMethod, user: KeycloakUser,
                               details: VariableDetails | None = None) -> bool:
        return self._is_authorized(method=method, resource_type=RESOURCE_VARIABLE, user=user)

    def is_authorized_view(self, *, access_view: AccessView, user: KeycloakUser) -> bool:
        method: ResourceMethod = "MENU" if access_view == AccessView.DOCS else "GET"
        return self._is_authorized(
            method=method,
            resource_type=get_map_access_view_to_resource_type()[access_view],
            user=user,
        )

    def is_authorized_custom_view(self, *, method: ResourceMethod | str, resource_name: str, user: KeycloakUser) -> bool:
        return True

    def filter_authorized_menu_items(self, menu_items: list[MenuItem], *, user: KeycloakUser) -> list[MenuItem]:
        return [
            menu_item
            for menu_item in menu_items
            if self._is_authorized(
                method="MENU",
                resource_type=get_map_menu_item_to_keycloak_resource_type().get(menu_item, menu_item.value),
                user=user,
            )
        ]

    @staticmethod
    def get_cli_commands() -> list[CLICommand]:
        return []

    def get_fastapi_app(self) -> FastAPI | None:
        """
        Specify a sub FastAPI application specific to the auth manager.

        This sub application, if specified, is mounted in the main FastAPI application.
        """

        from airflow.providers.keycloak.auth_manager.api_fastapi.routes.login import (
            login_router,
        )

        directory = Path(__file__).parent.parent.joinpath("ui", "dist")
        directory.mkdir(exist_ok=True)

        templates = Jinja2Templates(directory=directory)

        app = FastAPI(
            title="Keycloak auth manager API",
            description=(
                "This is Keycloak auth manager API. This API is only available if the auth manager used in "
                "the Airflow environment is Keycloak auth manager. "
                "This API provides endpoints to manage users and permissions managed by the Keycloak auth "
                "manager."
            ),
        )

        app.include_router(login_router)

        app.mount(
            "/static",
            StaticFiles(
                directory=directory,
                html=True,
            ),
            name="keycloak_auth_manager_ui_folder",
        )

        @app.get("/{rest_of_path:path}", response_class=HTMLResponse, include_in_schema=False)
        def webapp(request: Request):
            return templates.TemplateResponse(
                "index.html",
                {"request": request, "backend_server_base_url": request.base_url.path},
                media_type="text/html",
            )

        return app

    def get_extra_menu_items(self, *, user: KeycloakUser) -> list[ExtraMenuItem]:
        items = [
            {
                "resource_type": "Users",
                "text": "Users",
                "href": f"{AUTH_MANAGER_FASTAPI_APP_PREFIX}/users/list/",
            },
            {
                "resource_type": "Roles",
                "text": "Roles",
                "href": f"{AUTH_MANAGER_FASTAPI_APP_PREFIX}/roles/list/",
            },
            # {
            #     "resource_type": "Actions",
            #     "text": "Actions",
            #     "href": f"{AUTH_MANAGER_FASTAPI_APP_PREFIX}/actions/list/",
            # },
            # {
            #     "resource_type": "Resources",
            #     "text": "Resources",
            #     "href": f"{AUTH_MANAGER_FASTAPI_APP_PREFIX}/resources/list/",
            # },
            {
                "resource_type": "Permissions",
                "text": "Permissions",
                "href": f"{AUTH_MANAGER_FASTAPI_APP_PREFIX}/permissions/list/",
            },
        ]

        return [
            ExtraMenuItem(text=item["text"], href=item["href"])
            for item in items
            if self._is_authorized(method="MENU", resource_type=item["resource_type"], user=user)
        ]

    def _is_authorized(
        self,
        *,
        method: ResourceMethod,
        resource_type: str,
        user: KeycloakUser,
    ) -> bool:
        """
        Return whether the user is authorized to perform a given action.

        :param method: the method to perform
        :param resource_type: the type of resource the user attempts to perform the action on
        :param user: the user to performing the action

        :meta private:
        """
        kc_action = self._get_kc_action(method)
        user_permissions = self._get_user_permissions(user)

        return (kc_action, resource_type) in user_permissions

    @staticmethod
    def _get_kc_action(method):
        kc_action_from_method_map = get_kc_action_from_method_map()
        if method not in kc_action_from_method_map:
            raise AirflowException(f"Unknown method: {method}")
        return kc_action_from_method_map[method]

    @staticmethod
    def _get_user_permissions(user: KeycloakUser):
        if not user:
            return []

        user_roles = user.roles

        permissions = []

        for role in user_roles:
            permissions += get_map_kc_role_to_permission(role.upper())

        return permissions

    def _is_authorized_dag_details(
        self,
        method: ResourceMethod,
        details: DagDetails | None,
        user: KeycloakUser):
        """
        Return whether the user is authorized to perform a given action on a DAG.

        :param method: the method to perform
        :param details: details about the DAG
        :param user: the user to performing the action

        :meta private:
        """
        is_global_authorized = self._is_authorized(method=method, resource_type=RESOURCE_DAG, user=user)
        if is_global_authorized:
            return True

        if details and details.id:
            # Check whether the user has permissions to access a specific DAG
            resource_dag_name = permissions.resource_name(details.id, RESOURCE_DAG)
            return self._is_authorized(method=method, resource_type=resource_dag_name, user=user)

        return False

    def _is_authorized_dag_run(
        self,
        method: ResourceMethod,
        details: DagDetails | None,
        user: KeycloakUser,
    ) -> bool:
        """
        Return whether the user is authorized to perform a given action on a DAG Run.

        :param method: the method to perform
        :param details: details about the DAG
        :param user: the user to performing the action

        :meta private:
        """
        is_global_authorized = self._is_authorized(method=method, resource_type=RESOURCE_DAG_RUN, user=user)
        if is_global_authorized:
            return True

        if details and details.id:
            # Check whether the user has permissions to access a specific DAG Run permission on a DAG Level
            resource_dag_name = permissions.resource_name(details.id, RESOURCE_DAG)
            return self._is_authorized(method=method, resource_type=resource_dag_name, user=user)

        return False

    @staticmethod
    def _get_resource_types(access_entity):
        map_ae_rt = get_map_dag_access_entity_to_resource_type()
        if access_entity not in map_ae_rt:
            raise AirflowException(f"Unknown DAG access entity: {access_entity}")
        return map_ae_rt[access_entity]
