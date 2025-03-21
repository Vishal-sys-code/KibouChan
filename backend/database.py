from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Any

# MongoDB connection settings
MONGO_URL = "mongodb://localhost:27017/"
DB_NAME = "kibouchan_db"
COLLECTION_NAME = "journal_entries"

def get_db():
    """
    Get MongoDB database connection
    
    Yields:
        MongoDB database instance
    """
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    try:
        yield db
    finally:
        client.close()

def save_journal_entry(db, text: str, emotion: str, timestamp: datetime):
    """
    Save a journal entry to the database
    
    Args:
        db: MongoDB database instance
        text: Journal entry text
        emotion: Detected emotion
        timestamp: Entry timestamp
    
    Returns:
        ID of the inserted document
    """
    collection = db[COLLECTION_NAME]
    
    document = {
        "text": text,
        "emotion": emotion,
        "timestamp": timestamp
    }
    
    result = collection.insert_one(document)
    return result.inserted_id

def get_all_entries(db) -> List[Dict[str, Any]]:
    """
    Get all journal entries from the database
    
    Args:
        db: MongoDB database instance
    
    Returns:
        List of journal entries
    """
    collection = db[COLLECTION_NAME]
    
    # Retrieve entries sorted by timestamp (newest first)
    entries = list(collection.find({}, {"_id": 0}).sort("timestamp", -1))
    
    # Convert datetime objects to strings for JSON serialization
    for entry in entries:
        entry["timestamp"] = entry["timestamp"].isoformat()
    
    return entries 