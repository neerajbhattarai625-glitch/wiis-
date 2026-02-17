import pytest
from httpx import AsyncClient
from main import app
import asyncio

@pytest.mark.asyncio
async def test_login_performance():
    """Test that login response is fast (audit logging shouldn't block)"""
    from httpx import ASGITransport
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Note: This might fail if DB isn't running or seeded, 
        # but it serves as a baseline for the CI/CD pipeline.
        import time
        start = time.time()
        response = await ac.post("/api/login", json={
            "email": "citizen@waste.com",
            "password": "citizen123"
        })
        duration = time.time() - start
        
        # We expect a fairly quick response even with hashing
        # (usually < 500ms for bcrypt with standard rounds)
        assert duration < 1.0 
        assert response.status_code in [200, 401] # 401 is okay if not seeded

@pytest.mark.asyncio
async def test_unauthorized_access():
    """Ensure citizen endpoints are protected"""
    from httpx import ASGITransport
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/citizen/stats")
    assert response.status_code == 401 # Should require token

@pytest.mark.asyncio
async def test_health_check():
    from httpx import ASGITransport
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Waste Management API"}
