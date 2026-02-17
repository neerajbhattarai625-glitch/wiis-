from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from models import Token, UserLogin, UserSession as UserSessionSchema, User as UserSchema
from tables import User, UserSession
from database import get_db
from utils import verify_password, create_access_token, get_password_hash, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
import random
from datetime import datetime
from fastapi import UploadFile, File
import shutil
import os

router = APIRouter()

# New model for registration since we need more fields
from pydantic import BaseModel, EmailStr
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str
    name: str

@router.post("/register")
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="User already exists")
    
    otp = str(random.randint(100000, 999999))
    user = User(
        email=user_in.email,
        password=get_password_hash(user_in.password),
        role=user_in.role,
        name=user_in.name,
        otp=otp,
        is_verified=False
    )
    db.add(user)
    await db.commit()
    
    print(f"DEBUG: OTP for {user_in.email} is {otp}")
    return {"message": "User registered. Please verify OTP.", "email": user_in.email}

@router.post("/verify-otp")
async def verify_otp(email: str, otp: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user or user.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    user.otp = None # Clear OTP
    # Note: We don't set is_verified=True yet, that happens after Admin ID verification
    await db.commit()
    return {"message": "OTP verified successfully. Please upload your Citizenship ID photo."}

@router.post("/upload-id")
async def upload_id(email: str, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    os.makedirs("uploads/ids", exist_ok=True)
    file_path = f"uploads/ids/{user.id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    user.id_photo_url = file_path
    await db.commit()
    return {"message": "ID uploaded successfully. Awaiting Admin verification."}

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
    
    if not user.is_verified and user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account pending verification. Please wait for admin approval."
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

@router.get("/sessions", response_model=List[UserSessionSchema])
async def get_sessions(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserSession).filter(UserSession.user_id == current_user.id))
    sessions = result.scalars().all()
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

@router.post("/seed")
async def seed_users(db: AsyncSession = Depends(get_db)):
    users = [
        {"email": "citizen@waste.com", "role": "citizen", "password": "citizen123", "name": "Jane Citizen", "verified": True},
        {"email": "collector@waste.com", "role": "collector", "password": "collector123", "name": "Collector Joe", "verified": True},
        {"email": "admin@waste.com", "role": "admin", "password": "admin123", "name": "Admin User", "verified": True},
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
                name=user_data["name"],
                is_verified=user_data["verified"]
            )
            db.add(user)
            count += 1
            
    await db.commit()
    return {"message": f"Seeded {count} new users"}

