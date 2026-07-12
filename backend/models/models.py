from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from database.database import Base


# ==========================
# Product
# ==========================

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)
    price = Column(Float)
    image = Column(String)
    description = Column(String)

    cart_items = relationship("Cart", back_populates="product")


# ==========================
# User
# ==========================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)


# ==========================
# Cart
# ==========================

class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False
    )

    quantity = Column(Integer, default=1)

    product = relationship(
        "Product",
        back_populates="cart_items"
    )


# ==========================
# Order
# ==========================

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    total_amount = Column(Float, nullable=False)

    status = Column(String, default="Pending")