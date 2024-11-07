import joblib
import numpy as np
import time
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from connect_blt import send_brl
import requests

app = Flask(__name__)
CORS(app)
THINGSPEAK_API_KEY = "DRPOKVWY9095DPYY"

model = joblib.load('./models/action_classification.joblib')
vectorizer = joblib.load('./models/text_vectorizer.joblib')
#du doan hanh dong
def classify_command(text_command):
    command_vector = vectorizer.transform([text_command])
    probabilities = model.predict_proba(command_vector)
    predicted_label_index = probabilities.argmax()
    predicted_label = model.classes_[predicted_label_index]
    max_probability = probabilities[0][predicted_label_index]
    print(max_probability)
    if max_probability < 0.3:
        return "S"
    else:
        return predicted_label

def send_to_thingspeak(distance):
    url = f"https://api.thingspeak.com/update?api_key={THINGSPEAK_API_KEY}&field1={distance}"
    response = requests.get(url)
    
    if response.status_code == 200:
        print(f"Data sent to ThingSpeak: {distance}")
    else:
        print(f"Failed to send data to ThingSpeak: {response.status_code}")

def periodic_send():
    while True:
        response = send_brl("0")
        if response:
            try:
                distance = int(response)
                send_to_thingspeak(distance) 
            except ValueError:
                print("Received invalid data from ESP32")
        
        time.sleep(2)

@app.route('/controll', methods=['POST'])
def control_car():
    data = request.get_json()
    
    if not data or 'speech' not in data:
        return jsonify({"error": "No speech command received"}), 400
    
    speech_command = data['speech']
    speech_command = speech_command.rstrip('.')

    print(f"Received speech command: {classify_command(speech_command)}")
    send_brl(classify_command(speech_command))
    return jsonify({"speech": classify_command(speech_command)})
    

if __name__ == "__main__":
    threading.Thread(target=periodic_send, daemon=True).start()
    app.run(debug=True, host='0.0.0.0')

