from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from uuid import UUID

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenData(BaseModel):
    id: Optional[int] = None
    is_admin: Optional[bool] = False

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut