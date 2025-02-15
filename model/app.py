from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

model = joblib.load('egwinch_pricing_model.joblib')

app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MoveRequest(BaseModel):
    distance_km: float
    items_count: int
    pickup_floor: int
    dropoff_floor: int
    fragile_items: int
    additional_services: int

@app.post('/predict_move_price')
def predict_move_price(request: MoveRequest):
    input_data = np.array([[request.distance_km, request.items_count, 
                            request.pickup_floor, request.dropoff_floor, 
                            request.fragile_items, request.additional_services]])
    
    # Make prediction
    prediction = model.predict(input_data)[0]

    # Return rounded prediction
    return {"predicted_price": round(float(prediction), 2)}
