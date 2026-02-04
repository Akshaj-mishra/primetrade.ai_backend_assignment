from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List



class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str = "user" 

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ChecklistItem(BaseModel):
    text: str
    done: bool = False


class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = None
    items: List[ChecklistItem] = []
    color: str = "#fff8b5"
    pinned: bool = False


class NoteOut(BaseModel):
    id: str
    title: str
    content: Optional[str]
    items: List[ChecklistItem]
    color: str
    pinned: bool
    created_at: datetime
