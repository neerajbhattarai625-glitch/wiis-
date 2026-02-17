from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from models import Token, UserLogin, UserSession as UserSessionSchema
from tables import User, UserSession
from database import get_db
from utils import verify_password, create_access_token, get_password_hash, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

@router.get("/sessions", response_model=List[UserSessionSchema])
async def get_sessions(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserSession).filter(UserSession.user_id == current_user.id))
    sessions = result.scalars().all()
    # Convert SQLAlchemy objects to Pydantic models if needed, or rely on ORM mode
    # Assuming Pydantic models have `from_attributes=True` (v2) or `orm_mode=True` (v1)
    return sessions

@router.delete("/sessions/{session_id}")
async def revoke_session(session_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserSession).filter(UserSession.id == session_id, UserSession.user_id == current_user.id))
    session = result.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    await db.delete(session)
    await db.commit()
    return {"message": "Session revoked"}

@router.post("/login", response_model=Token)
async def login(user_login: UserLogin, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_login.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_login.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.email}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Create User Session
    user_session = UserSession(
        user_id=user.id,
        token=access_token, 
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "unknown")
    )
    db.add(user_session)
    await db.commit()

    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.post("/seed")
async def seed_users(db: AsyncSession = Depends(get_db)):
    users = [
        {"email": "citizen@waste.com", "role": "citizen", "password": "citizen123", "name": "Jane Citizen"},
        {"email": "collector@waste.com", "role": "collector", "password": "collector123", "name": "Collector Joe"},
        {"email": "admin@waste.com", "role": "admin", "password": "admin123", "name": "Admin User"},
    ]
    
    count = 0
    for user_data in users:
        result = await db.execute(select(User).filter(User.email == user_data["email"]))
        existing = result.scalars().first()
        
        if not existing:
            user = User(
                email=user_data["email"],
                role=user_data["role"],
                password=get_password_hash(user_data["password"]),
                name=user_data["name"]
            )
            db.add(user)
            count += 1
            
    await db.commit()
    return {"message": f"Seeded {count} new users"}

