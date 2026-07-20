from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from uuid import UUID

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    image_url: Optional[str] = None
    category: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class ProductOut(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    price: float
    stock: int
    image_url: Optional[str]
    category: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)