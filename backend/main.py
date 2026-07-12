from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from database.database import Base, engine

from routers.auth import router as auth_router
from routers.products import router as product_router
from routers.cart import router as cart_router
from routers.orders import router as order_router

# ==========================================
# Create Database Tables
# ==========================================

Base.metadata.create_all(bind=engine)

# ==========================================
# FastAPI App
# ==========================================

app = FastAPI(
    title="NovaCart API",
    version="1.0.0"
)

# ==========================================
# Static Files
# ==========================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

# ==========================================
# Templates
# ==========================================

templates = Jinja2Templates(directory="templates")

# ==========================================
# Frontend Pages
# ==========================================

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request
        }
    )


@app.get("/products")
def products_page(request: Request):
    return templates.TemplateResponse(
        "products.html",
        {
            "request": request
        }
    )


@app.get("/product-details")
def product_details(request: Request):
    return templates.TemplateResponse(
        "product-details.html",
        {
            "request": request
        }
    )


@app.get("/cart")
def cart_page(request: Request):
    return templates.TemplateResponse(
        "cart.html",
        {
            "request": request
        }
    )


@app.get("/checkout")
def checkout_page(request: Request):
    return templates.TemplateResponse(
        "checkout.html",
        {
            "request": request
        }
    )


@app.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse(
        "login.html",
        {
            "request": request
        }
    )


@app.get("/signup")
def signup_page(request: Request):
    return templates.TemplateResponse(
        "signup.html",
        {
            "request": request
        }
    )


@app.get("/order-success")
def order_success_page(request: Request):
    return templates.TemplateResponse(
        "order-success.html",
        {
            "request": request
        }
    )

# ==========================================
# API Routers
# ==========================================

app.include_router(auth_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(order_router)