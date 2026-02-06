from pymongo import MongoClient
import os
from dotenv import load_dotenv
import certifi  # 1. Import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["keep_notes"]

users = db["users"]
notes = db["notes"]