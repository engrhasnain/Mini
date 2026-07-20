from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.cart import Cart
from app.models.product import Product
from app.schemas.order import OrderOut
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def place_order(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart_items = db.query(Cart).filter(Cart.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0.0
    order_items = []

    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product not found: {item.product_id}")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

        total += product.price * item.quantity
        order_items.append(OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        ))
        product.stock -= item.quantity

    order = Order(
        user_id=current_user.id,
        total_price=total,
        status="pending"
    )
    db.add(order)
    db.flush()  # get order.id before committing

    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)

    # clear cart
    db.query(Cart).filter(Cart.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return order


@router.get("/", response_model=List[OrderOut])
def get_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order