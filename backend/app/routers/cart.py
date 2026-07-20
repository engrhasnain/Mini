from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.models.cart import Cart
from app.models.product import Product
from app.schemas.cart import CartAdd, CartUpdate, CartItemOut
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/", response_model=List[CartItemOut])
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Cart).filter(Cart.user_id == current_user.id).all()


@router.post("/", response_model=CartItemOut, status_code=status.HTTP_201_CREATED)
def add_to_cart(payload: CartAdd, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    existing = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.product_id == payload.product_id
    ).first()

    if existing:
        existing.quantity += payload.quantity
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = Cart(
        user_id=current_user.id,
        product_id=payload.product_id,
        quantity=payload.quantity
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


@router.patch("/{item_id}", response_model=CartItemOut)
def update_cart_item(item_id: UUID, payload: CartUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Cart).filter(Cart.id == item_id, Cart.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if payload.quantity <= 0:
        db.delete(item)
        db.commit()
        raise HTTPException(status_code=200, detail="Item removed")
    item.quantity = payload.quantity
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Cart).filter(Cart.id == item_id, Cart.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(Cart).filter(Cart.user_id == current_user.id).delete()
    db.commit()