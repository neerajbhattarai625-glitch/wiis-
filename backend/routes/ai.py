from fastapi import APIRouter, File, UploadFile
from typing import List
import random
from datetime import datetime

router = APIRouter()

@router.post("/classify-waste")
async def classify_waste(file: UploadFile = File(...)):
    # MOCK AI Service
    # In reality, load TensorFlow/PyTorch model here
    
    # Simulate processing delay
    import time
    time.sleep(1)
    
    # Randomly predict for demo purposes
    categories = ["Organic", "Recyclable", "Hazardous"]
    prediction = random.choice(categories)
    confidence = random.uniform(0.85, 0.99)
    
    return {
        "filename": file.filename,
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "message": f"Detected {prediction} waste with {int(confidence*100)}% confidence."
    }

@router.get("/hotspots")
async def get_waste_hotspots():
    # Return simulated lat/lng heatmap data
    # Pokhara coordinates approx
    base_lat = 28.2096
    base_lng = 83.9856
    
    hotspots = []
    for _ in range(20):
        hotspots.append({
            "lat": base_lat + random.uniform(-0.02, 0.02),
            "lng": base_lng + random.uniform(-0.02, 0.02),
            "intensity": random.randint(1, 10), # 1-10 scale of pile-up
        })
        
    return hotspots

@router.get("/insights")
async def get_ai_insights():
    return {
        "waste_generation_trend": "Increasing by 5% this week",
        "optimal_collection_time": "06:00 AM - 08:00 AM",
        "recycling_efficiency": "78% (Good)",
        "predicted_overflow": ["Main Street Bin #4", "Lakeside Bin #2"]
    }
