from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)
    name = Column(String, nullable=True)
    credit_points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Verification & OTP
    is_verified = Column(Boolean, default=False)
    id_photo_url = Column(String, nullable=True)
    otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)

class UserSession(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    token = Column(String, index=True)
    ip_address = Column(String)
    user_agent = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    active = Column(Boolean, default=True)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String)
    message = Column(String)
    type = Column(String) # 'info', 'success', 'warning'
    read = Column(Boolean, default=False)
    date = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    action = Column(String)
    endpoint = Column(String)
    ip_address = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    amount = Column(Integer)
    type = Column(String) # 'earned', 'spent'
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String) # 'pickup', 'report', 'purchase'
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    impact_co2 = Column(Float, default=0.0)

class PickupRequest(Base):
    __tablename__ = "pickup_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    waste_type = Column(String) # 'organic', 'recyclable', 'hazardous'
    amount_approx = Column(String) # '1 bag', '2-5 bags', 'truck load'
    location = Column(JSON) # {lat: float, lng: float, address: str}
    scheduled_date = Column(DateTime)
    status = Column(String, default="pending") # 'pending', 'assigned', 'completed', 'cancelled'
    request_date = Column(DateTime, default=datetime.utcnow)
    collected_at = Column(DateTime, nullable=True)
    collector_id = Column(String, ForeignKey("users.id"), nullable=True)

class WasteReport(Base):
    __tablename__ = "waste_reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    report_type = Column(String) # 'overflow', 'illegal_dumping', 'missed_pickup'
    description = Column(String)
    location = Column(JSON) # {lat: float, lng: float, address: str}
    image_url = Column(String, nullable=True)
    status = Column(String, default="reported") # 'reported', 'investigating', 'resolved'
    report_date = Column(DateTime, default=datetime.utcnow)

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String)
    message = Column(String)
    priority = Column(String, default="normal") # 'low', 'normal', 'high', 'urgent'
    target_role = Column(String, default="all") # 'all', 'citizen', 'collector'
    date = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    description = Column(String)
    cost = Column(Integer)
    image_url = Column(String)
    stock = Column(Integer)
    category = Column(String, default="eco-friendly")

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(String, primary_key=True, default=generate_uuid)
    type = Column(String, default="global", unique=True)
    credits_per_kg = Column(Float, default=10.0)
    referral_bonus = Column(Integer, default=50)
    withdrawal_minimum = Column(Integer, default=1000)
    system_version = Column(String, default="1.0.0")

class Block(Base):
    __tablename__ = "blockchain"

    id = Column(String, primary_key=True, default=generate_uuid)
    index = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    transactions = Column(JSON)
    previous_hash = Column(String)
    hash = Column(String)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    product_id = Column(String, ForeignKey("products.id"))
    quantity = Column(Integer)
    total_cost = Column(Integer)
    status = Column(String, default="confirmed")
    date = Column(DateTime, default=datetime.utcnow)
