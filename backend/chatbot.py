import os
import requests

API_KEY = os.environ.get("OPENROUTER_API_KEY", "YOUR_FREE_API_KEY")

def smart_chatbot(disease):
    prompt = f"You are an agriculture expert. Disease: {disease}. Give cause, pesticide, usage, prevention in Hindi + English."

    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "mistral-7b-instruct",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        if API_KEY == "YOUR_FREE_API_KEY":
            # Mock fallback if key isn't provided
            return f"As an AI expert, here's simulated advice for {disease}: Use appropriate fungicides for fungal issues, ensure proper watering, and maintain good soil health."
        
        response = requests.post(url, headers=headers, json=data, timeout=20)
        response.raise_for_status() # Raise exception for bad status codes
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Chatbot error: {e}")
        return f"Could not connect to AI service. Basic advice for {disease}: Please consult a local agricultural extension office or use targeted treatments for this condition."
