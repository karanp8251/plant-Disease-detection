import sys
from pathlib import Path

# Vercel loads backend/main.py from repo root; ensure sibling modules resolve.
_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from model import predict_disease
from products import products
from chatbot import smart_chatbot

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        img = Image.open(file.file)
        disease, confidence = predict_disease(img)
        
        # Ensure we have a product recommendation even for "Healthy" or unknown
        product = products.get(disease, {"name": "No specific product needed", "price": 0})
        chatbot = smart_chatbot(disease)

        return {
            "disease": disease,
            "confidence": round(confidence * 100, 2),
            "product": product,
            "chatbot": chatbot
        }
    except Exception as e:
        print(f"Error during prediction: {e}")
        return {"error": str(e)}
