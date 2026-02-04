from fastapi import APIRouter, HTTPException, Header
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from bson import ObjectId
import os
import logging # Added for assignment logging requirements

from main.Database import users, notes
from main.schemas import UserRegister, UserLogin, NoteCreate

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGO = "HS256"

def hash_pass(p):
    return pwd.hash(p)

def verify_pass(p, h):
    return pwd.verify(p, h)

def create_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGO)

def get_user(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        return payload["user_id"]
    except JWTError:
        raise HTTPException(401, "Invalid token")

@router.post("/register")
def register(data: UserRegister):
    if users.find_one({"email": data.email}):
        raise HTTPException(400, "User exists")

    users.insert_one({
        "email": data.email,
        "password": hash_pass(data.password),
        "role": data.role
    })
    logging.info(f"New user registered: {data.email}")
    return {"message": "Registered successfully"}

@router.post("/login")
def login(data: UserLogin):
    user = users.find_one({"email": data.email})
    if not user or not verify_pass(data.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_token(str(user["_id"]))
    logging.info(f"User logged in: {data.email}")
    return {"access_token": token}

@router.post("/notes")
def create_note(note: NoteCreate, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = get_user(token)

    notes.insert_one({
        "title": note.title,
        "content": note.content,
        "items": [i.dict() for i in note.items],
        "color": note.color,
        "pinned": note.pinned,
        "owner_id": user_id,
        "created_at": datetime.utcnow()
    })
    logging.info(f"User {user_id} created a note: {note.title}")
    return {"message": "Note created"}

@router.get("/notes")
def get_notes(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = get_user(token)

    data = []
    for n in notes.find({"owner_id": user_id}).sort("pinned", -1):
        data.append({
            "id": str(n["_id"]),
            "title": n["title"],
            "content": n.get("content"),
            "items": n.get("items", []),
            "color": n["color"],
            "pinned": n["pinned"],
            "created_at": n["created_at"]
        })
    return data

@router.patch("/notes/{note_id}")
def update_note(note_id: str, note: NoteCreate, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = get_user(token)

    result = notes.update_one(
        {"_id": ObjectId(note_id), "owner_id": user_id},
        {"$set": {
            "title": note.title,
            "content": note.content,
            "items": [i.dict() for i in note.items],
            "color": note.color,
            "pinned": note.pinned
        }}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404, 
            detail="Note not found or you do not have permission to edit it"
        )

    logging.info(f"User {user_id} updated note: {note_id}")
    return {"message": "Updated successfully"}

@router.delete("/notes/{note_id}")
def delete_note(note_id: str, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = get_user(token)

    result = notes.delete_one({
        "_id": ObjectId(note_id),
        "owner_id": user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(404, "Not found")

    logging.info(f"User {user_id} deleted note: {note_id}")
    return {"message": "Deleted"}

def get_current_user_role(token: str):
    user_id = get_user(token)  
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(404, "User not found")
    return user.get("role", "user")

@router.get("/admin/all-notes")
def get_all_users_notes(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    role = get_current_user_role(token)
    
    if role != "admin":
        raise HTTPException(403, "Access denied: Admins only") 
    
    all_notes = list(notes.find())
    return [{"id": str(n["_id"]), "title": n["title"]} for n in all_notes]