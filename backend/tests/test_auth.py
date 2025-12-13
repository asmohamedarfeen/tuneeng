import os

from fastapi.testclient import TestClient

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_tuneeng.db")

import main  # noqa: E402


client = TestClient(main.app)


def test_register_and_login_cycle():
    email = "demo.user@example.com"
    password = "DemoPass123!"
    full_name = "Demo User"

    # Register user
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": full_name,
        },
    )
    assert response.status_code in (201, 400)

    # Login
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == email


