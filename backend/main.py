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

@app.post("/predict")
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
