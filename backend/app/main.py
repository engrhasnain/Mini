from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings, UPLOAD_DIR
from app.database import Base, engine, SessionLocal
from app.routers import auth, products, cart, orders, admin

# Import all models so SQLAlchemy can create tables
from app.models import user, product, order, cart as cart_model
from app.models.user import User
from app.core.security import hash_password

# Create all tables
Base.metadata.create_all(bind=engine)


def ensure_default_admin():
    """First run on a fresh database has no admin account yet - seed one
    so there's always a way in, without needing manual DB surgery."""
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.is_admin == True).first():
            db.add(User(
                name="Admin",
                email="admin@minimart.com",
                hashed_password=hash_password("Admin@12345"),
                is_admin=True,
            ))
            db.commit()
    finally:
        db.close()


ensure_default_admin()

app = FastAPI(title="SmartStore API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploaded product images
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "SmartStore API is running"}