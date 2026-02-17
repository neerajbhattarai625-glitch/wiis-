from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = None

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    role: str
    name: Optional[str] = None
    credit_points: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    id_photo_url: Optional[str] = None
    otp: Optional[str] = None
    otp_expiry: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "citizen@waste.com",
                "role": "citizen",
                "name": "John Citizen"
            }
        }
class Notification(BaseModel):
    user_id: str
    title: str
    message: str
    type: str # 'info', 'success', 'warning'
    read: bool = False
    date: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        orm_mode = True

class AuditLog(BaseModel):
    user_id: str
    action: str
    endpoint: str
    ip_address: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    class Config:
        orm_mode = True

class UserSession(BaseModel):
    user_id: str
    token: str
    ip_address: str
    user_agent: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    active: bool = True
    class Config:
        orm_mode = True

class CreditTransaction(BaseModel):
    user_id: str
    amount: int
    type: str # 'earned', 'spent'
    description: str
    date: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        orm_mode = True

class Activity(BaseModel):
    user_id: str
    type: str # 'pickup', 'report', 'purchase'
    description: str
    date: datetime = Field(default_factory=datetime.utcnow)
    impact_co2: float = 0.0
    class Config:
        orm_mode = True

class PickupRequest(BaseModel):
    user_id: str
    waste_type: str # 'organic', 'recyclable', 'hazardous'
    amount_approx: str # '1 bag', '2-5 bags', 'truck load'
    location: dict # {lat: float, lng: float, address: str}
    scheduled_date: datetime
    status: str = "pending" # 'pending', 'assigned', 'completed', 'cancelled'
    request_date: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        orm_mode = True

class WasteReport(BaseModel):
    user_id: str
    report_type: str # 'overflow', 'illegal_dumping', 'missed_pickup'
    description: str
    location: dict # {lat: float, lng: float, address: str}
    image_url: Optional[str] = None
    status: str = "reported" # 'reported', 'investigating', 'resolved'
    report_date: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        orm_mode = True

class Announcement(BaseModel):
    title: str
    message: str
    priority: str = "normal" # 'low', 'normal', 'high', 'urgent'
    target_role: str = "all" # 'all', 'citizen', 'collector'
    date: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        orm_mode = True

class SystemSettings(BaseModel):
    credits_per_kg: float = 10.0
    referral_bonus: int = 50
    withdrawal_minimum: int = 1000
    system_version: str = "1.0.0"
    class Config:
        orm_mode = True

class Product(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    cost: int
    image_url: str
    stock: int
    category: Optional[str] = "eco-friendly"
    class Config:
        orm_mode = True


class Block(BaseModel):
    index: int
    timestamp: datetime
    transactions: List[dict]
    previous_hash: str
    hash: str
    class Config:
        orm_mode = True

