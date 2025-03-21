# KibouChan (希望ちゃん) - Mental Health Web App

KibouChan is a full-stack mental health web application that helps users track their emotions and receive supportive suggestions based on their mood. The app uses machine learning to detect emotions from text entries and stores journal entries for mood tracking over time.

## Disclaimer
This website is under construction. If you want to work with me then you can mail me on: [pandeyvishal.mlprof@gmail.com](pandeyvishal.mlprof@gmail.com) <be>


## Features

- 🧠 **Emotion Detection**: Uses Hugging Face's machine learning model to analyze emotional content in text
- 💭 **Personalized Suggestions**: Provides custom suggestions based on detected emotions
- 📝 **Journal Entries**: Save your thoughts and emotions for later reflection
- 📊 **Mood History**: View your emotional journey over time
- 🎨 **Friendly UI**: Cute pastel-themed interface designed to be welcoming and calming

## Tech Stack

- **Backend**: FastAPI
- **Machine Learning**: Hugging Face emotion detection model (cardiffnlp/twitter-roberta-base-emotion)
- **Database**: MongoDB with pymongo
- **Frontend**: HTML, CSS, JavaScript

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- MongoDB installed and running locally (or a MongoDB Atlas account)
- Git

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd KibouChan
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Make sure MongoDB is running locally at `mongodb://localhost:27017/`
   - Or update the connection string in `backend/database.py` to point to your MongoDB instance

### Running the Application

1. Start the application:
   ```
   uvicorn backend.main:app --reload
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Usage

1. Enter your thoughts and feelings in the text area
2. Click "Analyze My Feelings" to get emotion analysis and suggestions
3. Save your entry to your journal if desired
4. View your mood history to track emotional patterns over time

## Project Structure

```
KibouChan/
├── backend/
│   ├── __init__.py
│   ├── main.py            # FastAPI application and routes
│   ├── emotion_model.py   # Emotion detection model
│   ├── database.py        # MongoDB connection and functions
│   └── schemas.py         # Pydantic models for data validation
├── frontend/
│   ├── templates/
│   │   └── index.html     # Main HTML template
│   └── static/
│       ├── app.js         # Frontend JavaScript
│       └── styles.css     # CSS styles
├── requirements.txt       # Python dependencies
└── README.md              # Project documentation
```

## License

[MIT License](LICENSE)

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Hugging Face](https://huggingface.co/) for the emotion detection model
- [MongoDB](https://www.mongodb.com/) for the database
