from airflow.plugins_manager import AirflowPlugin

class KeycloakAuthManagerPlugin(AirflowPlugin):
    name = "keycloak_auth_manager_plugin"

    external_views = [
        {
            "name": "Your View Name",
            "href": "https://example.com/your-view",
            "destination": "nav",
            # "category": "admin",
            "url_route": "your-view-route",
        }
    ]

    react_apps = [
        {
            "name": "Security",
            "bundle_url": "https://example.com/static/js/my_app.js",
            "destination": "nav",
            "url_route": "my_custom_tab",
            # "category": "admin",
        }
    ]
