from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, citizen, admin, collector, marketplace, ai, blockchain, realtime
from tables import AuditLog
from database import init_db, AsyncSessionLocal
import time
import asyncio
from datetime import datetime
from prometheus_client import make_asgi_app, Counter, Histogram

app = FastAPI(title="Waste Management API")

@app.on_event("startup")
async def startup_event():
    # Only initialize DB in local dev. 
    # In Vercel, we rely on the DB being ready.
    if os.getenv("VERCEL") != "1":
        await init_db()
        asyncio.create_task(realtime.broadcast_live_stats())

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for production demo simplicity, or restrict to vercel domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def log_audit_event(log_entry: dict):
    # Convert timestamp float to datetime
    timestamp = datetime.fromtimestamp(log_entry["timestamp"])
    
    async with AsyncSessionLocal() as session:
        audit_log = AuditLog(
            action=log_entry["method"], # Mapping method to action for now
            endpoint=log_entry["endpoint"],
            ip_address=log_entry["ip_address"],
            timestamp=timestamp,
            # user_id is missing here, ideally middleware should extract it or we make it nullable
            # For now let's assume it's nullable or handled elsewhere if user_id is needed
            user_id="system" # Placeholder or nullable
        )
        session.add(audit_log)
        await session.commit()

# Audit Log Middleware
@app.middleware("http")
async def audit_log_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Only log state-changing methods
    if request.method in ["POST", "PUT", "DELETE"]:
        log_entry = {
            "method": request.method,
            "endpoint": request.url.path,
            "ip_address": request.client.host,
            "status_code": response.status_code,
            "duration": process_time,
            "timestamp": time.time()
        }
        # Use a background task so we don't block the response
        background_tasks = BackgroundTasks()
        background_tasks.add_task(log_audit_event, log_entry)
        response.background = background_tasks
        
    # Update Prometheus Metrics
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path, status=response.status_code).inc()
    REQUEST_LATENCY.observe(process_time)
        
    return response

# Include Routers
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(citizen.router, prefix="/api/citizen", tags=["Citizen"])
app.include_router(collector.router, prefix="/api/collector", tags=["Collector"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Marketplace"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(blockchain.router, prefix="/api/blockchain", tags=["Blockchain"])
app.include_router(realtime.router, prefix="/api/realtime", tags=["Realtime"])

# Handle Prometheus metrics only if not in Vercel
if os.getenv("VERCEL") != "1":
    metrics_app = make_asgi_app()
    app.mount("/metrics", metrics_app)

# Custom Metrics
REQUEST_COUNT = Counter("http_requests_total", "Total HTTP Requests", ["method", "endpoint", "status"])
REQUEST_LATENCY = Histogram("http_request_duration_seconds", "HTTP Request Latency")

@app.get("/")
def read_root():
    return {"message": "Welcome to Waste Management API"}
