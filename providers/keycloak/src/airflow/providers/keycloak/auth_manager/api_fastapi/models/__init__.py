from airflow.api_fastapi.auth.managers.models.base_user import BaseUser


class KeycloakUser(BaseUser):
    """User model for KeycloakAuthManager."""
    def __init__(self,
                 id: str,
                 email_verified: bool,
                 name: str,
                 email: str,
                 roles: list[str]) -> None:
        self._id = id
        self._email_verified = email_verified
        self._name = name
        self._email = email
        self._roles = roles

    def get_id(self) -> str:
        return self._id

    @property
    def email_verified(self) -> bool:
        return self._email_verified

    def get_name(self) -> str:
        return self._name

    @property
    def email(self) -> str:
        return self._email

    @property
    def roles(self) -> list[str]:
        return self._roles

