from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import Base, engine
from app.routers import auth, products, cart, orders, admin

# Import all models so SQLAlchemy can create tables
from app.models import user, product, order, cart as cart_model

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartStore API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "SmartStore API is running"}