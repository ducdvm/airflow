import mimetypes
from pathlib import Path

from airflow.plugins_manager import AirflowPlugin
from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

mimetypes.add_type("application/javascript", ".cjs")
app = FastAPI(
    title="Keycloak auth manager Plugin",
    description=(
        "This is Keycloak auth manager Plugin. This Plugin is only available if the auth manager used in "
        "the Airflow environment is Keycloak auth manager. "
        "This Plugin provides endpoints to manage users and permissions managed by the Keycloak auth "
        "manager."
    ),
)

react_app_directory = Path(__file__).parent.joinpath("ui", "dist")
app.mount(
    "/static",
    StaticFiles(directory=react_app_directory, html=True),
    name="keycloak_auth_manager_ui_plugin_folder",
)


class KeycloakAuthManagerPlugin(AirflowPlugin):
    name = "keycloak_auth_manager_plugin"

    # Serve static files
    fastapi_apps = [
        {
            "app": app,
            "url_prefix": "/plugins/keycloak_auth_manager",
            "name": "Keycloak auth manager plugin static server",
        }
    ]

    # Register React application
    react_apps = [
        {
            "name": "Airflow Security",
            "url_route": "security/users",
            "bundle_url": "/plugins/keycloak_auth_manager/static/main.umd.cjs",
            "destination": "nav",
        }
    ]
