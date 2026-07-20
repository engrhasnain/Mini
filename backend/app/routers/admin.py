import uuid as uuid_lib
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.models.product import Product
from app.models.order import Order
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut
from app.schemas.order import OrderOut, OrderStatusUpdate
from app.schemas.user import UserOut
from app.core.dependencies import get_admin_user
from app.core.config import UPLOAD_DIR

router = APIRouter(prefix="/admin", tags=["Admin"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB


# --- Image Upload ---

@router.post("/products/upload-image")
async def upload_product_image(
    request: Request,
    file: UploadFile = File(...),
    _: User = Depends(get_admin_user),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP or GIF images are allowed")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image must be smaller than 5MB")

    ext = Path(file.filename or "").suffix.lower() or ".jpg"
    filename = f"{uuid_lib.uuid4()}{ext}"
    (UPLOAD_DIR / filename).write_bytes(contents)

    return {"url": f"{str(request.base_url).rstrip('/')}/uploads/{filename}"}


# --- Products ---

@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: UUID, payload: ProductUpdate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()


# --- Orders ---

@router.get("/orders", response_model=List[OrderOut])
def get_all_orders(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(Order).order_by(Order.created_at.desc()).all()


@router.patch("/orders/{order_id}", response_model=OrderOut)
def update_order_status(order_id: UUID, payload: OrderStatusUpdate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    valid_statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order


# --- Users ---

@router.get("/users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(User).all()