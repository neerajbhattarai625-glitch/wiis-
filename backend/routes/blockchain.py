from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from database import get_db
from tables import Block
from models import Block as BlockSchema
from utils import get_current_user
from datetime import datetime
import hashlib
import json

router = APIRouter()

class SmartContractCall(BaseModel):
    contract_address: str
    function: str
    params: dict

def calculate_hash(block_data):
    # Simple SHA256 hash of block content
    block_string = json.dumps(block_data, sort_keys=True, default=str).encode()
    return hashlib.sha256(block_string).hexdigest()

@router.get("/ledger")
async def get_ledger(limit: int = 50, db: AsyncSession = Depends(get_db)):
    # Fetch blocks from DB
    result = await db.execute(select(Block).order_by(Block.index.desc()).limit(limit))
    chain = result.scalars().all()
    return chain

@router.post("/smart-contract/execute")
async def execute_smart_contract(call: SmartContractCall, db: AsyncSession = Depends(get_db)):
    # SIMULATED Smart Contract Execution
    # For WIIS-Coin (Reward Token)
    
    if call.function == "mintReward":
        user_id = call.params.get("user_id")
        amount = call.params.get("amount")
        
        # Verify conditions (e.g., waste verified?)
        # For simulation, we assume valid
        
        # Create a new Block
        result = await db.execute(select(Block).order_by(Block.index.desc()).limit(1))
        last_block = result.scalars().first()
        
        index = (last_block.index + 1) if last_block else 0
        prev_hash = last_block.hash if last_block else "0" * 64
        
        timestamp = datetime.utcnow()
        transactions = [{
            "from": "0x00000000000000000000000000000000", # Minting
            "to": f"user_{user_id}",
            "amount": amount,
            "type": "MINT"
        }]
        
        block_data = {
            "index": index,
            "timestamp": timestamp,
            "transactions": transactions,
            "previous_hash": prev_hash
        }
        
        block_hash = calculate_hash(block_data)
        
        new_block = Block(
            index=index,
            timestamp=timestamp,
            transactions=transactions,
            previous_hash=prev_hash,
            hash=block_hash
        )
        
        db.add(new_block)
        await db.commit()
        
        return {"status": "success", "tx_hash": block_hash, "message": "Smart Contract Executed: Rewards Minted"}
        
    return {"status": "error", "message": "Function not found"}

@router.get("/token/balance/{user_id}")
async def get_token_balance(user_id: str, db: AsyncSession = Depends(get_db)):
    # In a real blockchain, we'd index this separately.
    # Here we have to scan blocks. For MVP, let's just scan recent 100 blocks.
    result = await db.execute(select(Block).order_by(Block.index.desc()).limit(100))
    chain = result.scalars().all()
    
    balance = 0
    for block in chain:
        if block.transactions:
            # transactions is a list of dicts
            for tx in block.transactions:
                if tx.get("to") == f"user_{user_id}":
                    balance += float(tx.get("amount", 0))
                # Handle spending if implemented
                
    return {"user_id": user_id, "balance": balance, "token": "WIIS"}
