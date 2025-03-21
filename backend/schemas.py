from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class EmotionResponse(BaseModel):
    """Response model for emotion prediction"""
    emotion: str
    suggestion: str
    text: str

class JournalEntry(BaseModel):
    """Model for journal entries"""
    text: str
    emotion: str
    timestamp: datetime
    
    class Config:
        schema_extra = {
            "example": {
                "text": "I had a great day today!",
                "emotion": "joy",
                "timestamp": "2023-08-15T14:30:00"
            }
        }

class HistoryResponse(BaseModel):
    """Response model for history endpoint"""
    entries: List[JournalEntry] 