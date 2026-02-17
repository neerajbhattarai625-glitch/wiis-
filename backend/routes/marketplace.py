from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from database import get_db
from tables import User, CreditTransaction, Product, Order
from models import Product as ProductSchema
from utils import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class OrderRequest(BaseModel):
    product_id: str
    quantity: int

@router.get("/products", response_model=List[ProductSchema])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).limit(100))
    products = result.scalars().all()
    
    if not products:
        # Seed if empty
        mock_products_data = [
            {"name": "Eco-Tote Bag", "description": "Reusable cotton bag", "cost": 100, "image_url": "https://placehold.co/200", "stock": 50},
            {"name": "Bamboo Toothbrush", "description": "Biodegradable handle", "cost": 50, "image_url": "https://placehold.co/200", "stock": 100},
            {"name": "Compost Bin", "description": "Indoor composting unit", "cost": 500, "image_url": "https://placehold.co/200", "stock": 20},
            {"name": "Metal Straw Set", "description": "Stainless steel straws", "cost": 30, "image_url": "https://placehold.co/200", "stock": 200},
        ]
        
        new_products = []
        for p_data in mock_products_data:
            product = Product(
                name=p_data["name"],
                description=p_data["description"],
                cost=p_data["cost"],
                image_url=p_data["image_url"],
                stock=p_data["stock"]
            )
            db.add(product)
            new_products.append(product)
            
        await db.commit()
        # Refresh to get IDs? Or just return the objects (ID might be populated after commit/flush)
        # For list response, we can just return what we added
        return new_products
        
    return products

@router.post("/order")
async def place_order(order: OrderRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Get product
    result = await db.execute(select(Product).filter(Product.id == order.product_id))
    product = result.scalars().first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    if product.stock < order.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
        
    total_cost = product.cost * order.quantity
    
    # Check user credits (Use db aggregation or fetch recent balance)
    # Simple check: Aggregating all transactions
    result_balance = await db.execute(
        select(func.sum(CreditTransaction.amount))
        .filter(CreditTransaction.user_id == current_user.id)
    )
    balance = result_balance.scalar() or 0
    
    if balance < total_cost:
        raise HTTPException(status_code=400, detail=f"Insufficient credits. Balance: {balance}, Required: {total_cost}")
        
    # Deduct credits
    transaction = CreditTransaction(
        user_id=current_user.id,
        amount=-total_cost,
        type="spent",
        description=f"Purchased {order.quantity} x {product.name}"
    )
    db.add(transaction)
    
    # Create Order record
    new_order = Order(
        user_id=current_user.id,
        product_id=order.product_id,
        quantity=order.quantity,
        total_cost=total_cost,
        status="confirmed",
        date=datetime.utcnow()
    )
    db.add(new_order)
    
    # Update stock
    product.stock -= order.quantity
    
    await db.commit()
    
    return {"message": "Order placed successfully", "balance": balance - total_cost}
