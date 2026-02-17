from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, delete, update
from database import get_db
from tables import AuditLog, User, Product, WasteReport, Announcement, SystemSettings, CreditTransaction, Activity, PickupRequest
from models import AuditLog as AuditLogSchema, User as UserSchema, Product as ProductSchema, WasteReport as WasteReportSchema, Announcement as AnnouncementSchema, SystemSettings as SystemSettingsSchema
from utils import get_current_user
import json

router = APIRouter()

# Helper to check admin role
async def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/audit-logs", response_model=List[AuditLogSchema])
async def get_audit_logs(limit: int = 50, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit))
    logs = result.scalars().all()
    return logs

@router.get("/stats")
async def get_system_stats(admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    user_count_res = await db.execute(select(func.count(User.id)))
    user_count = user_count_res.scalar()
    
    activity_count_res = await db.execute(select(func.count(Activity.id)))
    activity_count = activity_count_res.scalar()
    
    pickup_count_res = await db.execute(select(func.count(PickupRequest.id)))
    pickup_count = pickup_count_res.scalar()
    
    revenue_res = await db.execute(
        select(func.sum(CreditTransaction.amount))
        .filter(CreditTransaction.type == "spent")
    )
    revenue = revenue_res.scalar() or 0
    
    return {
        "users": user_count,
        "activities": activity_count,
        "pickup_requests": pickup_count,
        "total_credits_spent": abs(revenue)
    }

# --- User Management ---
@router.get("/users", response_model=List[UserSchema])
async def get_all_users(limit: int = 100, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).limit(limit))
    users = result.scalars().all()
    return users

@router.put("/users/{user_id}")
async def update_user_role(user_id: str, role: str, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role
    await db.commit()
    return {"message": "User role updated"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db.delete(user)
    await db.commit()
    return {"message": "User deleted successfully"}

# --- Marketplace Management ---
@router.post("/products")
async def add_product(product: ProductSchema, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    new_product = Product(
        name=product.name,
        description=product.description,
        cost=product.cost,
        image_url=product.image_url,
        stock=product.stock,
        category=product.category
    )
    db.add(new_product)
    await db.commit()
    return {"id": new_product.id, "message": "Product added"}

@router.put("/products/{product_id}")
async def update_product(product_id: str, update: dict, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in update.items():
        if hasattr(product, key):
            setattr(product, key, value)
            
    await db.commit()
    return {"message": "Product updated"}

@router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    await db.delete(product)
    await db.commit()
    return {"message": "Product removed"}

# --- Feedback Management ---
@router.get("/feedback", response_model=List[WasteReportSchema])
async def get_all_feedback(admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WasteReport).order_by(WasteReport.report_date.desc()).limit(100))
    reports = result.scalars().all()
    return reports

@router.post("/feedback/{report_id}/resolve")
async def resolve_feedback(report_id: str, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WasteReport).filter(WasteReport.id == report_id))
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    report.status = "resolved"
    await db.commit()
    return {"message": "Report marked as resolved"}

# --- Broadcasts ---
@router.post("/announce")
async def broadcast_announcement(announcement: AnnouncementSchema, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    # from routes.realtime import manager # Avoid circular import if possible, or import inside
    # msg = json.dumps({
    #     "type": "announcement",
    #     "title": announcement.title,
    #     "message": announcement.message,
    #     "priority": announcement.priority
    # })
    # await manager.broadcast_to_admins(msg) # Simple broadcast for MVP
    
    # Save to DB
    new_announcement = Announcement(
        title=announcement.title,
        message=announcement.message,
        priority=announcement.priority,
        target_role=announcement.target_role
    )
    db.add(new_announcement)
    await db.commit()
    return {"message": "Announcement broadcasted and saved"}

@router.get("/announcements", response_model=List[AnnouncementSchema])
async def get_announcements(limit: int = 50, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Announcement).order_by(Announcement.date.desc()).limit(limit))
    announcements = result.scalars().all()
    return announcements

# --- Leaderboard ---
@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User)
        .filter(User.role == "citizen")
        .order_by(User.credit_points.desc())
        .limit(limit)
    )
    citizens = result.scalars().all()
    
    leaderboard = []
    for idx, c in enumerate(citizens):
        leaderboard.append({
            "rank": idx + 1,
            "name": c.name or "Eco Warrior",
            "points": c.credit_points,
            "id": c.id
        })
    return leaderboard

# --- Settings ---
@router.get("/settings")
async def get_settings(admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SystemSettings).filter(SystemSettings.type == "global"))
    settings = result.scalars().first()
    
    if not settings:
        # Create default settings if not exist
        settings = SystemSettings(type="global")
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
        
    return settings

@router.post("/settings")
async def update_settings(settings: SystemSettingsSchema, admin: User = Depends(verify_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SystemSettings).filter(SystemSettings.type == "global"))
    current_settings = result.scalars().first()
    
    if not current_settings:
        current_settings = SystemSettings(type="global")
        db.add(current_settings)
    
    current_settings.credits_per_kg = settings.credits_per_kg
    current_settings.referral_bonus = settings.referral_bonus
    current_settings.withdrawal_minimum = settings.withdrawal_minimum
    current_settings.system_version = settings.system_version
    
    await db.commit()
    return {"message": "System settings updated"}
