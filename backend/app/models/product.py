from sqlalchemy import Column, String, Float, Integer, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base
from app.core.types import GUID

class Product(Base):
    __tablename__ = "products"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    cart_items = relationship("Cart", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")