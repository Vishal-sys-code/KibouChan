from fastapi import FastAPI, Request, Form, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn
from pathlib import Path
from datetime import datetime

from .emotion_model import predict_emotion, get_suggestion
from .database import get_db, save_journal_entry, get_all_entries
from .schemas import JournalEntry, EmotionResponse

app = FastAPI(title="KibouChan - Mental Health App")

# Set up templates and static files
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "frontend" / "templates"))
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
templates = Jinja2Templates(directory="frontend/templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Serve the main HTML page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict", response_model=EmotionResponse)
async def predict(text: str = Form(...)):
    """Predict emotion from text and return with suggestion"""
    emotion = predict_emotion(text)
    suggestion = get_suggestion(emotion)
    
    return EmotionResponse(
        emotion=emotion,
        suggestion=suggestion,
        text=text
    )

@app.post("/journal")
async def create_journal_entry(text: str = Form(...), db=Depends(get_db)):
    """Save journal entry to database"""
    emotion = predict_emotion(text)
    timestamp = datetime.now()
    
    entry_id = save_journal_entry(db, text, emotion, timestamp)
    
    return {"id": str(entry_id), "message": "Journal entry saved successfully"}

@app.get("/history")
async def get_history(db=Depends(get_db)):
    """Get all journal entries"""
    entries = get_all_entries(db)
    return {"entries": entries}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True) 