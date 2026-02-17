import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from main import app
import json

@pytest.fixture(scope="function")
async def admin_token():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # First ensure seeded
        await ac.post("/api/seed")
        
        # Login as admin
        response = await ac.post("/api/login", json={
            "email": "admin@waste.com",
            "password": "admin123"
        })
        return response.json()["access_token"]

@pytest.mark.asyncio
async def test_admin_stats(admin_token):
    transport = ASGITransport(app=app)
    headers = {"Authorization": f"Bearer {admin_token}"}
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/admin/stats", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert "activities" in data
        assert "pickup_requests" in data

@pytest.mark.asyncio
async def test_admin_users_list(admin_token):
    transport = ASGITransport(app=app)
    headers = {"Authorization": f"Bearer {admin_token}"}
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/admin/users", headers=headers)
        assert response.status_code == 200
        users = response.json()
        assert len(users) >= 1
        assert "email" in users[0]
        assert "password" not in users[0]

@pytest.mark.asyncio
async def test_admin_marketplace_flow(admin_token):
    transport = ASGITransport(app=app)
    headers = {"Authorization": f"Bearer {admin_token}"}
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Create product
        new_product = {
            "name": "Test Product",
            "description": "Admin created",
            "cost": 100,
            "image_url": "http://img.com",
            "stock": 10
        }
        response = await ac.post("/api/admin/products", json=new_product, headers=headers)
        assert response.status_code == 200
        product_id = response.json()["id"]
        
        # Update product
        response = await ac.put(f"/api/admin/products/{product_id}", json={"stock": 5}, headers=headers)
        assert response.status_code == 200
        
        # Delete product
        response = await ac.delete(f"/api/admin/products/{product_id}", headers=headers)
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_admin_announcement(admin_token):
    transport = ASGITransport(app=app)
    headers = {"Authorization": f"Bearer {admin_token}"}
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        announcement = {
            "title": "System Update",
            "message": "We are upgrading our servers today.",
            "priority": "high",
            "target_role": "all"
        }
        response = await ac.post("/api/admin/announce", json=announcement, headers=headers)
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_admin_settings(admin_token):
    transport = ASGITransport(app=app)
    headers = {"Authorization": f"Bearer {admin_token}"}
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Get settings
        response = await ac.get("/api/admin/settings", headers=headers)
        assert response.status_code == 200
        
        # Update settings
        new_settings = {
            "credits_per_kg": 15.5,
            "referral_bonus": 100,
            "withdrawal_minimum": 500,
            "system_version": "1.1.0"
        }
        response = await ac.post("/api/admin/settings", json=new_settings, headers=headers)
        assert response.status_code == 200
        assert response.json()["message"] == "System settings updated"

@pytest.mark.asyncio
async def test_admin_leaderboard(admin_token):
    transport = ASGITransport(app=app)
    headers = {"Authorization": f"Bearer {admin_token}"}
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/admin/leaderboard", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_admin_access_denied_for_citizen():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Login as citizen
        response = await ac.post("/api/login", json={
            "email": "citizen@waste.com",
            "password": "citizen123"
        })
        citizen_token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {citizen_token}"}
        
        # Try to access admin stats
        response = await ac.get("/api/admin/stats", headers=headers)
        assert response.status_code == 403
