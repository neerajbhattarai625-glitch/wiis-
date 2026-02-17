from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, cast, Date
from database import get_db
from tables import User, Activity, Notification, CreditTransaction, PickupRequest, WasteReport
from models import Activity as ActivitySchema, Notification as NotificationSchema
import qrcode
import io
from fastapi.responses import StreamingResponse

router = APIRouter()

# Helper to get user by email
async def get_user_by_email(email: str, db: AsyncSession):
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/stats/{email}")
async def get_citizen_stats(email: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(email, db)
    user_id = user.id
    
    # Calculate total credits
    result_credits = await db.execute(
        select(func.sum(CreditTransaction.amount))
        .filter(CreditTransaction.user_id == user_id, CreditTransaction.type == "earned")
    )
    total_credits = result_credits.scalar() or 0
    
    # Calculate CO2 saved
    result_co2 = await db.execute(
        select(func.sum(Activity.impact_co2))
        .filter(Activity.user_id == user_id)
    )
    total_co2 = result_co2.scalar() or 0.0
    
    # Count waste collections (activities of type 'pickup')
    result_pickup = await db.execute(
        select(func.count(Activity.id))
        .filter(Activity.user_id == user_id, Activity.type == "pickup")
    )
    waste_collected = result_pickup.scalar() or 0
    
    # Mock rank for now
    rank = 156
    
    return {
        "credits": total_credits,
        "waste_collected": waste_collected,
        "co2_saved": round(total_co2, 2),
        "rank": rank
    }

@router.get("/activities/{email}", response_model=List[ActivitySchema])
async def get_activities(email: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(email, db)
    
    result = await db.execute(
        select(Activity)
        .filter(Activity.user_id == user.id)
        .order_by(Activity.date.desc())
        .limit(5)
    )
    activities = result.scalars().all()
    return activities

@router.get("/notifications/{email}", response_model=List[NotificationSchema])
async def get_notifications(email: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(email, db)
    
    result = await db.execute(
        select(Notification)
        .filter(Notification.user_id == user.id)
        .order_by(Notification.date.desc())
        .limit(10)
    )
    notifications = result.scalars().all()
    return notifications

@router.post("/seed-data/{email}")
async def seed_citizen_data(email: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(email, db)
    user_id = user.id
    
    # Check if data already exists
    result_count = await db.execute(select(func.count(Activity.id)).filter(Activity.user_id == user_id))
    if result_count.scalar() > 0:
        return {"message": "Data already seeded"}
    
    # Seed Activities
    activities = [
        Activity(user_id=user_id, type="pickup", description="Plastic Waste Collection", impact_co2=2.5),
        Activity(user_id=user_id, type="report", description="Reported Overflowing Bin", impact_co2=0.5),
        Activity(user_id=user_id, type="pickup", description="Organic Waste Collection", impact_co2=1.8),
    ]
    db.add_all(activities)
    
    # Seed Credits
    credits = [
        CreditTransaction(user_id=user_id, amount=50, type="earned", description="Waste Pickup Reward"),
        CreditTransaction(user_id=user_id, amount=20, type="earned", description="Verified Report"),
        CreditTransaction(user_id=user_id, amount=35, type="earned", description="Recycling Bonus"),
    ]
    db.add_all(credits)
    
    # Seed Notifications
    notifications = [
        Notification(user_id=user_id, title="Pickup Scheduled", message="Your organic waste pickup is scheduled for tomorrow.", type="info"),
        Notification(user_id=user_id, title="Credits Earned", message="You earned 50 credits for your recent collection!", type="success"),
        Notification(user_id=user_id, title="System Alert", message="Late pickups expected due to heavy rain.", type="warning"),
    ]
    db.add_all(notifications)
    
    await db.commit()
    return {"message": "Citizen data seeded successfully"}

from models import PickupRequest as PickupRequestSchema, WasteReport as WasteReportSchema

@router.post("/request-pickup")
async def request_pickup(request: PickupRequestSchema, db: AsyncSession = Depends(get_db)):
    new_request = PickupRequest(
        user_id=request.user_id,
        waste_type=request.waste_type,
        amount_approx=request.amount_approx,
        location=request.location,
        scheduled_date=request.scheduled_date,
        status=request.status
    )
    db.add(new_request)
    await db.flush() # to get ID
    
    # Log activity
    activity = Activity(
        user_id=request.user_id,
        type="pickup_request",
        description=f"Requested {request.waste_type} pickup",
        impact_co2=0.0
    )
    db.add(activity)
    
    # Broadcast to collectors
    from routes.realtime import manager
    import json
    msg = json.dumps({
        "type": "pickup_notice",
        "user_id": request.user_id,
        "waste_type": request.waste_type,
        "amount": request.amount_approx,
        "location": request.location
    })
    # We use create_task to not block the request
    import asyncio
    asyncio.create_task(manager.broadcast_to_collectors(msg))
    
    await db.commit()
    
    return {"message": "Pickup requested successfully", "id": new_request.id}

@router.post("/report-waste")
async def report_waste(report: WasteReportSchema, db: AsyncSession = Depends(get_db)):
    new_report = WasteReport(
        user_id=report.user_id,
        report_type=report.report_type,
        description=report.description,
        location=report.location,
        image_url=report.image_url,
        status=report.status
    )
    db.add(new_report)
    await db.flush()
    
    # Log activity
    activity = Activity(
        user_id=report.user_id,
        type="report",
        description=f"Reported {report.report_type}",
        impact_co2=0.0
    )
    db.add(activity)
    
    # Award small credit for reporting (gamification)
    credit = CreditTransaction(
        user_id=report.user_id,
        amount=5,
        type="earned",
        description="Report Reward"
    )
    db.add(credit)
    await db.commit()
    
    return {"message": "Waste reported successfully", "id": new_report.id}

@router.get("/qr-code/{email}")
async def generate_qr_code(email: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(email, db)
    user_id = user.id
    
    # Generate QR code with user ID
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(f"WIIS:USER:{user_id}")
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to bytes
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return StreamingResponse(img_byte_arr, media_type="image/png")

@router.get("/carbon-footprint/{email}")
async def get_carbon_footprint(email: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(email, db)
    user_id = user.id
    
    # Aggregate CO2 by date
    # In Postgres we can use cast(Activity.date, Date) to group by day
    # Or func.date_trunc('day', Activity.date)
    
    result = await db.execute(
        select(
            cast(Activity.date, Date).label("date"),
            func.sum(Activity.impact_co2).label("co2"),
            func.count(Activity.id).label("count")
        )
        .filter(Activity.user_id == user_id, Activity.impact_co2 > 0)
        .group_by(cast(Activity.date, Date))
        .order_by("date")
    )
    
    daily_data = result.all()
    
    # Format for frontend
    formatted_data = [{"date": str(d.date), "co2": round(d.co2, 2), "activities": d.count} for d in daily_data]
    
    return formatted_data
