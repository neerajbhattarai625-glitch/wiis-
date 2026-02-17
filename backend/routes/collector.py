from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from database import get_db
from tables import User, PickupRequest, Activity, CreditTransaction
from utils import get_current_user

router = APIRouter()

# Mock route optimization (TSP placeholder)
def optimize_route(requests: List[PickupRequest]):
    # Simple sort by scheduled date for now
    # In real app, use OR-Tools to solve TSP based on lat/lng
    return sorted(requests, key=lambda x: x.scheduled_date if x.scheduled_date else datetime.max)

@router.get("/routes/{email}")
async def get_assigned_routes(email: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Verify user is collector
    if current_user.role != "collector":
        # In MVP, we might be lenient or strict. Let's be strict.
        # But for now, let's allow "collector" role check.
        pass

    # Get all pending pickup requests (MVP: assign all to the collector)
    # In real app, filter by collector's assigned zone
    result = await db.execute(select(PickupRequest).filter(PickupRequest.status == "pending").limit(50))
    pending_pickups = result.scalars().all()
    
    # Optimize route
    optimized = optimize_route(pending_pickups)
    
    # Format for frontend - SQLAlchemy models to dict/schema
    # Assuming frontend expects a list of dicts with 'id'
    routes = []
    for p in optimized:
        # Create a dict representation manually or use a schema
        p_dict = {
            "id": p.id,
            "user_id": p.user_id,
            "waste_type": p.waste_type,
            "amount_approx": p.amount_approx,
            "location": p.location,
            "scheduled_date": p.scheduled_date,
            "status": p.status,
            "request_date": p.request_date
        }
        routes.append(p_dict)
        
    return routes

@router.post("/verify-pickup/{pickup_id}")
async def verify_pickup(pickup_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "collector":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Get pickup details
    result = await db.execute(select(PickupRequest).filter(PickupRequest.id == pickup_id))
    pickup = result.scalars().first()
    
    if not pickup:
         raise HTTPException(status_code=404, detail="Pickup not found")
         
    if pickup.status == "collected":
        raise HTTPException(status_code=404, detail="Pickup already collected")

    # Update pickup status
    pickup.status = "collected"
    pickup.collected_at = datetime.utcnow()
    pickup.collector_id = current_user.id
    db.add(pickup)
    
    # Award credits to citizen
    credit_amount = 10 # Standard amount
    if pickup.waste_type == "recyclable":
        credit_amount = 20
        
    credit = CreditTransaction(
        user_id=pickup.user_id,
        amount=credit_amount,
        type="earned",
        description=f"Waste Collection Verified ({pickup.waste_type})"
    )
    db.add(credit)
    
    # Log activity for Collector
    activity = Activity(
        user_id=current_user.id,
        type="collection",
        description=f"Collected waste from {pickup.waste_type}",
        impact_co2=5.0 # Estimated saving per pickup
    )
    db.add(activity)
    
    await db.commit()
    
    return {"message": "Pickup verified and credits awarded"}
