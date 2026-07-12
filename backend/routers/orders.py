from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.models import Order
from schemas.schemas import OrderCreate

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# -----------------------------
# CREATE ORDER
# -----------------------------
@router.post("/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):

    new_order = Order(
        user_id=order.user_id,
        total_amount=order.total_amount
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return {
        "message": "Order Placed Successfully",
        "order": new_order
    }


# -----------------------------
# GET ALL ORDERS
# -----------------------------
@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()