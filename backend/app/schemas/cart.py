# from pydantic import BaseModel
# from datetime import datetime
# from typing import Optional
# from app.schemas.product import ProductOut
# from uuid import UUID

# class CartAdd(BaseModel):
#     product_id: int
#     quantity: int = 1

# class CartUpdate(BaseModel):
#     quantity: int

# class CartItemOut(BaseModel):
#     id: UUID
#     product_id: int
#     quantity: int
#     added_at: datetime
#     product: ProductOut           # <-- full product info including image_url

#     class Config:
#         from_attributes = True


from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from uuid import UUID
from app.schemas.product import ProductOut

class CartAdd(BaseModel):
    product_id: UUID  # ← Fixed: UUID, not int
    quantity: int = 1

    model_config = ConfigDict(from_attributes=True)  # ← Pydantic v2 syntax

class CartUpdate(BaseModel):
    quantity: int

    model_config = ConfigDict(from_attributes=True)

class CartItemOut(BaseModel):
    id: UUID
    product_id: UUID  # ← Fixed: UUID, not int
    quantity: int
    added_at: datetime
    product: ProductOut

    model_config = ConfigDict(from_attributes=True)