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

from airflow.configuration import conf
from airflow.exceptions import AirflowException
from keycloak import KeycloakAdmin
from keycloak.exceptions import KeycloakGetError, KeycloakPostError, KeycloakPutError, KeycloakDeleteError

from airflow.providers.keycloak.auth_manager.api_fastapi.datamodels.security import UserRequest


class KeycloakAuthManagerSecurity:
    """
    Security management Service for KeycloakAuthManager.
    Handles CRUD operations on Keycloak users and token management.
    """

    _keycloak_admin: KeycloakAdmin | None = None

    @classmethod
    def _get_keycloak_admin(cls) -> KeycloakAdmin:
        """Lazily initialize and return a single KeycloakAdmin instance."""
        if cls._keycloak_admin is None:
            cls._keycloak_admin = KeycloakAdmin(
                server_url=conf.get("keycloak_auth_manager", "server_url"),
                username=conf.get("keycloak_auth_manager", "admin_username"),
                password=conf.get("keycloak_auth_manager", "admin_password"),
                realm_name=conf.get("keycloak_auth_manager", "realm", "airflow"),
                verify=True
            )
        return cls._keycloak_admin

    # ------------------ CREATE ------------------
    @classmethod
    def create_user(cls, body: UserRequest) -> tuple[str, int] | tuple[int, str]:
        """Create a new user in Keycloak and return their user ID.
        Return: userid and timestamp in success case
        or error code and error message in failure case
        """
        admin = cls._get_keycloak_admin()
        user_payload = {
            "username": body.username,
            "email": body.email,
            "firstName": body.first_name,
            "lastName": body.last_name,
            "enabled": True,
            "emailVerified": body.email_verified,
            "credentials": [
                {
                    "value": body.password,
                    "type": "password",
                    "temporary": False
                }
            ]
        }
        # TODO: include timestamps
        try:
            new_userid = admin.create_user(user_payload)

            cls._set_user_role(user_id=new_userid, role_name=body.role)

            user = admin.get_user(new_userid)
            attrs = user.get("attributes", {})
            created_ts = attrs.get("createdTimestamp", 0)  # not done

            return new_userid, created_ts
        except KeycloakPostError as e:
            msg = e.response_body.decode() if isinstance(e.response_body, bytes) else str(e.response_body)

            if e.response_code == 409:  # already exists
                if "username" in msg:
                    return 409, "username"
                else:
                    return 409, "email"

            return e.response_code, msg

    @classmethod
    def _set_user_role(cls, user_id: str, role_name: str) -> None:
        admin = cls._get_keycloak_admin()
        client_uuid = admin.get_client_id(conf.get("keycloak_auth_manager", "client_id"))
        role = admin.get_client_role(client_id=client_uuid, role_name=role_name)

        current_roles = admin.get_client_roles_of_user(user_id=user_id, client_id=client_uuid)
        if current_roles:
            admin.delete_client_roles_of_user(user_id=user_id, client_id=client_uuid, roles=current_roles)

        admin.assign_client_role(user_id=user_id, client_id=client_uuid, roles=[role])

    @classmethod
    def _set_user_password(cls, user_id: str, password: str) -> None:
        admin = cls._get_keycloak_admin()
        admin.set_user_password(
            user_id=user_id,
            password=password,
            temporary=False
        )

    # ------------------ READ ------------------
    @classmethod
    def get_user(cls, username: str) -> dict:
        """Get user details by username."""
        admin = cls._get_keycloak_admin()
        try:
            user_id = admin.get_user_id(username)
            if not user_id:
                raise AirflowException(f"User '{username}' not found.")
            return admin.get_user(user_id)
        except KeycloakGetError as e:
            raise AirflowException(f"Failed to get user '{username}': {e}")

    @classmethod
    def list_users(cls, search: str | None = None) -> list[dict]:
        """List users, optionally filtered by a search string."""
        admin = cls._get_keycloak_admin()
        try:
            query = {"search": search} if search else {}
            return admin.get_users(query=query)
        except KeycloakGetError as e:
            raise AirflowException(f"Failed to list users: {e}")

    @classmethod
    def _get_user_roles(cls, user_id: str) -> list[str]:
        """
        Get roles for a specific user.
        Returns a list of role names.
        """
        admin = cls._get_keycloak_admin()
        try:
            client_uuid = admin.get_client_id(conf.get("keycloak_auth_manager", "client_id"))
            client_roles = admin.get_client_roles_of_user(user_id, client_uuid)

            role_names = [role.get("name") for role in client_roles if role.get("name")]

            return role_names
        except KeycloakGetError as e:
            raise AirflowException(f"Error fetching roles for user {user_id}: {e}")

    @classmethod
    def list_users_with_roles(cls) -> list[dict]:
        """
        List all users with their roles.
        """
        admin = cls._get_keycloak_admin()
        users = admin.get_users()

        for user in users:
            user_id = user.get("id")
            if user_id:
                user["roles"] = cls._get_user_roles(user_id)

        return users

    # ------------------ UPDATE ------------------
    @classmethod
    def update_user(cls, user_id: str, payload: dict) -> None | tuple:
        """Update a user given their userid."""
        admin = cls._get_keycloak_admin()
        try:
            if "role" in payload:
                cls._set_user_role(user_id, payload["role"])

            if "password" in payload:
                cls._set_user_password(user_id, payload["password"])

            normal_user_attributes = {k: v for k, v in payload.items() if k not in ["role", "password"]}
            admin.update_user(user_id=user_id, payload=normal_user_attributes)
        except KeycloakPutError as e:
            msg = e.response_body.decode() if isinstance(e.response_body, bytes) else str(e.response_body)

            if e.response_code == 409:  # already exists
                return 409, "email"

            return e.response_code, msg

    # ------------------ DELETE ------------------
    @classmethod
    def delete_user(cls, user_id: str) -> None:
        """Delete a user by username."""
        admin = cls._get_keycloak_admin()
        try:
            admin.delete_user(user_id)
        except KeycloakDeleteError as e:
            raise AirflowException(f"Failed to delete user: {e}")
