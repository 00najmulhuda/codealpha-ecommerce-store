from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from database.database import get_db
from models.models import Cart, Product
from schemas.schemas import CartCreate, CartUpdate

router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)

# ==========================
# Add To Cart
# ==========================

@router.post("/")
def add_to_cart(cart: CartCreate, db: Session = Depends(get_db)):

    product = db.query(Product).filter(
        Product.id == cart.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing = db.query(Cart).filter(
        Cart.user_id == cart.user_id,
        Cart.product_id == cart.product_id
    ).first()

    if existing:
        existing.quantity += cart.quantity
        db.commit()
        db.refresh(existing)

        return {
            "message": "Quantity Updated",
            "cart": existing
        }

    new_item = Cart(
        user_id=cart.user_id,
        product_id=cart.product_id,
        quantity=cart.quantity
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "message": "Product Added To Cart",
        "cart": new_item
    }


# ==========================
# Get Cart
# ==========================

@router.get("/")
def get_cart(db: Session = Depends(get_db)):

    items = db.query(Cart).options(
        joinedload(Cart.product)
    ).all()

    result = []

    for item in items:

        result.append({
            "cart_id": item.id,
            "quantity": item.quantity,

            "product": {
                "id": item.product.id,
                "name": item.product.name,
                "price": item.product.price,
                "image": item.product.image,
                "category": item.product.category,
                "description": item.product.description
            }
        })

    return result


# ==========================
# Update Quantity
# ==========================

@router.put("/{cart_id}")
def update_cart(
    cart_id: int,
    updated: CartUpdate,
    db: Session = Depends(get_db)
):

    item = db.query(Cart).filter(
        Cart.id == cart_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    item.quantity = updated.quantity

    db.commit()
    db.refresh(item)

    return {
        "message": "Updated",
        "cart": item
    }


# ==========================
# Delete Item
# ==========================

@router.delete("/{cart_id}")
def delete_cart(
    cart_id: int,
    db: Session = Depends(get_db)
):

    item = db.query(Cart).filter(
        Cart.id == cart_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Deleted Successfully"
    }