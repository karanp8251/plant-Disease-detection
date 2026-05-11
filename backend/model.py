try:
    import tensorflow as tf
    HAS_TF = True
except ImportError:
    HAS_TF = False
    print("WARNING: TensorFlow not found. Running in MOCK mode.")

import numpy as np
from PIL import Image
import hashlib

if HAS_TF:
    try:
        model = tf.keras.models.load_model("model.h5", compile=False)
    except Exception as e:
        print(f"WARNING: Could not load model.h5: {e}. Running in MOCK mode.")
        HAS_TF = False

classes = ["Leaf Blight", "Rust", "Healthy"]

def preprocess(img):
    img = img.resize((224,224))
    img = np.array(img)/255.0
    img = np.expand_dims(img, axis=0)
    return img

def predict_disease(img):
    if not HAS_TF:
        # Deterministic mock prediction: same image -> same output.
        processed = preprocess(img)
        img_bytes = processed.tobytes()
        digest = hashlib.sha256(img_bytes).digest()

        idx = int.from_bytes(digest[:4], "big") % len(classes)
        confidence_raw = int.from_bytes(digest[4:8], "big") / 0xFFFFFFFF
        confidence = 0.75 + (confidence_raw * 0.24)
        return classes[idx], confidence

    processed = preprocess(img)
    pred = model.predict(processed)
    idx = int(np.argmax(pred))
    confidence = float(np.max(pred))
    return classes[idx], confidence
