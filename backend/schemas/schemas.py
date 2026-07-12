from pydantic import BaseModel, EmailStr


# ---------- User ----------

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------- Product ----------

class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    image: str
    description: str


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

class CartCreate(BaseModel):
    user_id: int
    product_id: int
    quantity: int


class CartUpdate(BaseModel):
    quantity: int

class OrderCreate(BaseModel):
    user_id: int
    total_amount: float