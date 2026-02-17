from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import json
import asyncio

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Store active connections: user_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        self.admin_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        if client_id.startswith("admin"):
            self.admin_connections.append(websocket)
        else:
            self.active_connections[client_id] = websocket

    def disconnect(self, websocket: WebSocket, client_id: str):
        if client_id.startswith("admin"):
            if websocket in self.admin_connections:
                self.admin_connections.remove(websocket)
        else:
            if client_id in self.active_connections:
                del self.active_connections[client_id]

    async def send_personal_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)

    async def broadcast_to_admins(self, message: str):
        for connection in self.admin_connections:
            try:
                await connection.send_text(message)
            except:
                # Handle stale connections
                pass

    async def broadcast_tracking_update(self, driver_id: str, location: dict):
        # In a real app, only broadcast to users subscribed to this driver's route
        # For MVP, broadcast to all for demo effect
        message = json.dumps({"type": "tracking", "driver_id": driver_id, "location": location})
        for connection in self.active_connections.values():
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages
            message = json.loads(data)
            
            if message.get("type") == "location_update":
                # Driver sending location
                await manager.broadcast_tracking_update(client_id, message.get("location"))
                
            elif message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)

# Background task to simulate live analytics
async def broadcast_live_stats():
    import random
    while True:
        await asyncio.sleep(5)  # Update every 5 seconds
        stats = {
            "type": "analytics_update",
            "active_users": random.randint(100, 500),
            "co2_saved": random.randint(1000, 5000),
            "waste_collected": random.randint(500, 2000)
        }
        await manager.broadcast_to_admins(json.dumps(stats))
