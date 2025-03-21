from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import numpy as np
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Hugging Face token from environment
hf_token = os.getenv("HF_TOKEN")

# Load model and tokenizer - using a better model with authentication
MODEL_NAME = "cardiffnlp/twitter-roberta-base-emotion"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token=hf_token)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, token=hf_token)

# Emotion labels from the model
EMOTIONS = ["anger", "joy", "optimism", "sadness"]

def predict_emotion(text: str) -> str:
    """
    Predict emotion from text using the HuggingFace model
    
    Args:
        text: The text to analyze
        
    Returns:
        The predicted emotion as a string
    """
    # Tokenize the text
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    
    # Make prediction
    with torch.no_grad():
        outputs = model(**inputs)
        scores = outputs.logits.numpy()[0]
        
    # Get the highest scoring emotion
    emotion_idx = np.argmax(scores)
    return EMOTIONS[emotion_idx]

def get_suggestion(emotion: str) -> str:
    """
    Get a helpful suggestion based on the detected emotion
    
    Args:
        emotion: The detected emotion
        
    Returns:
        A suggestion string
    """
    suggestions = {
        "anger": "Take a deep breath and try to identify what's making you feel this way. Consider going for a walk or doing some physical activity to release tension.",
        
        "joy": "That's wonderful! Try to savor this positive feeling. Consider sharing this joy with someone else or writing down what made you happy so you can reflect on it later.",
        
        "optimism": "Your positive outlook is great! This is a good time to set goals or work on projects that require motivation and energy.",
        
        "sadness": "It's okay to feel sad sometimes. Be gentle with yourself today. Consider reaching out to a friend, enjoying a comforting activity, or practicing self-care."
    }
    
    return suggestions.get(emotion, "Take some time for self-care and reflection today.") 