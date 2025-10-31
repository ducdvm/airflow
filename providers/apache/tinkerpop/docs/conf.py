<<<<<<<< HEAD:providers/keycloak/src/airflow/providers/keycloak/auth_manager/api_fastapi/datamodels/login.py
#assword: str = Field()

========
# Disable Flake8 because of all the sphinx imports
#
>>>>>>>> 3.1.1:providers/apache/tinkerpop/docs/conf.py
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
"""Configuration of Providers docs building."""

from __future__ import annotations

from pydantic import Field

<<<<<<<< HEAD:providers/keycloak/src/airflow/providers/keycloak/auth_manager/api_fastapi/datamodels/login.py
from airflow.api_fastapi.core_api.base import StrictBaseModel, BaseModel


class LoginResponse(BaseModel):
    """Login serializer for responses."""

    access_token: str


class LoginBody(StrictBaseModel):
    """Login serializer for post bodies."""

    username: str = Field()
    password: str = Field()
========
os.environ["AIRFLOW_PACKAGE_NAME"] = "apache-airflow-providers-apache-tinkerpop"

from docs.provider_conf import *  # noqa: F403
>>>>>>>> 3.1.1:providers/apache/tinkerpop/docs/conf.py
