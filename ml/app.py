from flask import Flask, request, jsonify
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
import tensorflow as tf
import numpy as np
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Global variables for model and tokenizer
model = None
tokenizer = None

def load_model():
    """Load the mBERT model and tokenizer"""
    global model, tokenizer
    
    try:
        # Update this path to your actual model location
        model_path = r'G:\FYP\app\ml\mBERT_LR_2e-5'  # Update this path
        logger.info(f"Loading model from: {model_path}")
        
        # Check if the model directory exists
        if not os.path.exists(model_path):
            logger.error(f"Model directory does not exist: {model_path}")
            return False
        
        # List files in the directory for debugging
        logger.info("Files in model directory:")
        for file in os.listdir(model_path):
            logger.info(f"  {file}")
        
        # Check for required files
        config_path = os.path.join(model_path, 'config.json')
        if not os.path.exists(config_path):
            logger.error(f"config.json not found in {model_path}")
            return False
        
        # Load model and tokenizer from local path
        model = TFAutoModelForSequenceClassification.from_pretrained(
            model_path,
            local_files_only=True
        )
        tokenizer = AutoTokenizer.from_pretrained(
            model_path,
            local_files_only=True
        )
        
        logger.info("Model and tokenizer loaded successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        logger.error(f"Make sure the model directory contains: config.json, tf_model.h5, tokenizer files")
        return False

def predict_text(text):
    """Predict classification for a single text"""
    try:
        # Tokenize the input text
        inputs = tokenizer(text, padding=True, truncation=True, return_tensors='tf')
        
        # Get model predictions
        outputs = model(inputs)
        predictions = outputs.logits
        
        # Get the predicted class (0, 1, 2, or 3)
        predicted_class = int(np.argmax(predictions, axis=-1)[0])
        
        # Get confidence scores for all classes
        probabilities = tf.nn.softmax(predictions, axis=-1).numpy()[0]
        confidence_scores = {
            str(i): float(probabilities[i]) for i in range(len(probabilities))
        }
        
        return {
            'predicted_class': predicted_class,
            'confidence_scores': confidence_scores,
            'max_confidence': float(np.max(probabilities))
        }
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None and tokenizer is not None
    })

@app.route('/classify', methods=['POST'])
def classify_text():
    """Main classification endpoint"""
    try:
        # Check if model is loaded
        if model is None or tokenizer is None:
            return jsonify({
                'error': 'Model not loaded. Please restart the service.'
            }), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No JSON data provided'
            }), 400
        
        # Extract text from request
        text = data.get('text', '')
        
        if not text or not isinstance(text, str):
            return jsonify({
                'error': 'Invalid or missing text field'
            }), 400
        
        if len(text.strip()) == 0:
            return jsonify({
                'error': 'Empty text provided'
            }), 400
        
        # Make prediction
        result = predict_text(text)
        
        if result is None:
            return jsonify({
                'error': 'Prediction failed'
            }), 500
        
        # Return successful response
        return jsonify({
            'text': text,
            'predicted_class': result['predicted_class'],
            'confidence_scores': result['confidence_scores'],
            'max_confidence': result['max_confidence'],
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Error in classify_text: {str(e)}")
        return jsonify({
            'error': 'Internal server error'
        }), 500

@app.route('/classify/batch', methods=['POST'])
def classify_batch():
    """Batch classification endpoint"""
    try:
        # Check if model is loaded
        if model is None or tokenizer is None:
            return jsonify({
                'error': 'Model not loaded. Please restart the service.'
            }), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No JSON data provided'
            }), 400
        
        # Extract texts from request
        texts = data.get('texts', [])
        
        if not texts or not isinstance(texts, list):
            return jsonify({
                'error': 'Invalid or missing texts field (should be a list)'
            }), 400
        
        if len(texts) == 0:
            return jsonify({
                'error': 'Empty texts list provided'
            }), 400
        
        # Process each text
        results = []
        for i, text in enumerate(texts):
            if not isinstance(text, str) or len(text.strip()) == 0:
                results.append({
                    'index': i,
                    'error': 'Invalid or empty text'
                })
                continue
            
            result = predict_text(text)
            if result is None:
                results.append({
                    'index': i,
                    'error': 'Prediction failed'
                })
            else:
                results.append({
                    'index': i,
                    'text': text,
                    'predicted_class': result['predicted_class'],
                    'confidence_scores': result['confidence_scores'],
                    'max_confidence': result['max_confidence']
                })
        
        return jsonify({
            'results': results,
            'total_processed': len(texts),
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Error in classify_batch: {str(e)}")
        return jsonify({
            'error': 'Internal server error'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'error': 'Method not allowed'
    }), 405

if __name__ == '__main__':
    # Load model on startup
    logger.info("Starting Flask application...")
    
    if load_model():
        logger.info("Model loaded successfully. Starting server...")
        app.run(host='127.0.0.1', port=3001, debug=False)
    else:
        logger.error("Failed to load model. Server will not start.")
        exit(1)