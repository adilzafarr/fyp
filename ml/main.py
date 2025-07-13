from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import uvicorn
from typing import Dict, List
import logging
from contextlib import asynccontextmanager

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    logger.info("Starting up FastAPI server...")
    load_model()
    logger.info("Model loaded and ready for inference")
    yield
    # Shutdown (if needed)
    logger.info("Shutting down...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="mBERT Text Classification API",
    description="API for text classification using fine-tuned mBERT model",
    version="1.0.0",
    lifespan=lifespan
)

# Global variables for model and tokenizer
model = None
tokenizer = None
device = None

# Define request/response models
class TextRequest(BaseModel):
    text: str
    
class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    all_probabilities: Dict[str, float]

class BatchTextRequest(BaseModel):
    texts: List[str]
    
class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResponse]

# Configuration
class Config:
    MODEL_PATH = "./mbert"  # Path to your fine-tuned model
    MAX_LENGTH = 512
    CLASS_NAMES = ["0", "1", "2", "3"]  # Your actual class labels

def load_model():
    """Load the fine-tuned mBERT model and tokenizer"""
    global model, tokenizer, device
    
    try:
        # Determine device
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {device}")
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(Config.MODEL_PATH)
        logger.info("Tokenizer loaded successfully")
        
        # Try to load PyTorch model first, then TensorFlow if needed
        try:
            model = AutoModelForSequenceClassification.from_pretrained(Config.MODEL_PATH)
            logger.info("Model loaded successfully (PyTorch format)")
        except OSError as e:
            if "pytorch_model.bin" in str(e) and "TensorFlow weights" in str(e):
                logger.info("PyTorch weights not found, loading from TensorFlow weights...")
                model = AutoModelForSequenceClassification.from_pretrained(
                    Config.MODEL_PATH, 
                    from_tf=True
                )
                logger.info("Model loaded successfully (TensorFlow format)")
            else:
                raise e
        
        model.to(device)
        model.eval()
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise e

def preprocess_text(text: str) -> Dict:
    """Preprocess text for model input"""
    if not text or not text.strip():
        raise ValueError("Empty text provided")
    
    # Tokenize and encode
    inputs = tokenizer(
        text,
        truncation=True,
        padding=True,
        max_length=Config.MAX_LENGTH,
        return_tensors="pt"
    )
    
    # Move to device
    inputs = {key: value.to(device) for key, value in inputs.items()}
    return inputs

def predict_single(text: str) -> PredictionResponse:
    """Make prediction for a single text"""
    try:
        # Preprocess
        inputs = preprocess_text(text)
        
        # Make prediction
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # Get probabilities and predicted class
        probabilities = predictions[0].cpu().numpy()
        predicted_class_idx = probabilities.argmax()
        
        # Create response
        all_probabilities = {
            Config.CLASS_NAMES[i]: float(prob) 
            for i, prob in enumerate(probabilities)
        }
        
        response = PredictionResponse(
            predicted_class=Config.CLASS_NAMES[predicted_class_idx],
            confidence=float(probabilities[predicted_class_idx]),
            all_probabilities=all_probabilities
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")



@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "mBERT Classification API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device) if device else "unknown"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: TextRequest):
    """Single text prediction endpoint"""
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Empty text provided")
    
    logger.info(f"Received prediction request for text: {request.text[:50]}...")
    
    try:
        prediction = predict_single(request.text)
        logger.info(f"Prediction successful: {prediction.predicted_class}")
        return prediction
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchTextRequest):
    """Batch text prediction endpoint"""
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not request.texts:
        raise HTTPException(status_code=400, detail="No texts provided")
    
    if len(request.texts) > 100:  # Limit batch size
        raise HTTPException(status_code=400, detail="Batch size too large (max 100)")
    
    logger.info(f"Received batch prediction request for {len(request.texts)} texts")
    
    try:
        predictions = []
        for text in request.texts:
            if text.strip():  # Skip empty texts
                prediction = predict_single(text)
                predictions.append(prediction)
            else:
                # Handle empty text
                empty_response = PredictionResponse(
                    predicted_class="unknown",
                    confidence=0.0,
                    all_probabilities={name: 0.0 for name in Config.CLASS_NAMES}
                )
                predictions.append(empty_response)
        
        logger.info(f"Batch prediction successful for {len(predictions)} texts")
        return BatchPredictionResponse(predictions=predictions)
        
    except Exception as e:
        logger.error(f"Batch prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model_info")
async def model_info():
    """Get model information"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_path": Config.MODEL_PATH,
        "class_names": Config.CLASS_NAMES,
        "max_length": Config.MAX_LENGTH,
        "device": str(device),
        "model_parameters": sum(p.numel() for p in model.parameters()),
        "vocab_size": tokenizer.vocab_size if tokenizer else "unknown"
    }

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "main:app",  # Assuming this file is named main.py
        host="0.0.0.0",
        port=3002,
        reload=False,  # Set to True for development
        workers=1  # Single worker for model loading
    )