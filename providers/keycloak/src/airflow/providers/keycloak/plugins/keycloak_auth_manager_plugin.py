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
resource_directory = Path(__file__).parent.joinpath("ui", "src", "res")

app.mount(
    "/static",
    StaticFiles(directory=react_app_directory, html=True),
    name="keycloak_auth_manager_ui_plugin_folder",
)
app.mount(
    "/res",
    StaticFiles(directory=resource_directory, html=True),
    name="keycloak_auth_manager_ui_plugin_resource_folder"
)

class KeycloakAuthManagerPlugin(AirflowPlugin):
    name = "keycloak_auth_manager_plugin"

    fastapi_apps = [
        {
            "app": app,
            "url_prefix": "/keycloak_auth_manager",
            "name": "Keycloak auth manager plugin static server",
        }
    ]

    react_apps = [
        {
            "name": "Security",
            "url_route": "security",
            "bundle_url": "/keycloak_auth_manager/static/main.umd.cjs",
            "destination": "nav",
            "icon": "/keycloak_auth_manager/res/security-svgrepo-com.svg",
            "icon_dark_mode": "/keycloak_auth_manager/res/security-svgrepo-com-light.svg",
        }
    ]
