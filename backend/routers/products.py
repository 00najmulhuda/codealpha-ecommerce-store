from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.models import Product
from schemas.schemas import ProductCreate

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# -----------------------------
# GET ALL PRODUCTS
# -----------------------------
@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


# -----------------------------
# GET PRODUCT BY ID
# -----------------------------
@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# -----------------------------
# ADD PRODUCT
# -----------------------------
@router.post("/")
def add_product(product: ProductCreate, db: Session = Depends(get_db)):

    new_product = Product(
        name=product.name,
        category=product.category,
        price=product.price,
        image=product.image,
        description=product.description
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "message": "Product Added Successfully",
        "product": new_product
    }


# -----------------------------
# UPDATE PRODUCT
# -----------------------------
@router.put("/{product_id}")
def update_product(
    product_id: int,
    updated_product: ProductCreate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = updated_product.name
    product.category = updated_product.category
    product.price = updated_product.price
    product.image = updated_product.image
    product.description = updated_product.description

    db.commit()
    db.refresh(product)

    return {
        "message": "Product Updated Successfully",
        "product": product
    }


# -----------------------------
# DELETE PRODUCT
# -----------------------------
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product Deleted Successfully"
    }