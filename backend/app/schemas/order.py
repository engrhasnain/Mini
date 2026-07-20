from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.schemas.product import ProductOut
from uuid import UUID

class OrderItemOut(BaseModel):
    id: UUID
    product_id: UUID
    quantity: int
    unit_price: float
    product: ProductOut

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: UUID
    user_id: UUID
    total_price: float
    status: str
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str  # for admin to update order status