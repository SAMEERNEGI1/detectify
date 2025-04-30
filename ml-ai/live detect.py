import json
import cv2
import numpy as np
from flask import Flask, request, jsonify
from ultralytics import YOLO
import os

# Load model once
MODEL_PATH = r"C:\Users\samee\OneDrive\Desktop\detectify 2.0\ml-ai\runs\train\exp3\weights\best.pt"
model = YOLO(MODEL_PATH)

app = Flask(__name__)

def detect_objects(image):
    """
    Perform object detection on an image.
    :param image: Numpy array of the image.
    :return: List of detections with bounding boxes, class names, and confidence scores.
    """
    results = model(image)
    detections = []

    for result in results:
        boxes = result.boxes
        names = result.names
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
            class_id = int(box.cls[0].cpu().numpy())
            class_name = names[class_id]
            confidence = box.conf[0].item()
            detections.append({
                "class_name": class_name,
                "confidence": confidence,
                "bounding_box": [x1, y1, x2, y2]
            })
    
    return detections

@app.route('/live-detect', methods=['POST'])
def live_detect_api():
    """
    API endpoint for realtime detection from video frames.
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    image_np = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    if image_np is None:
        return jsonify({"error": "Invalid image"}), 400

    detections = detect_objects(image_np)
    return jsonify({"detections": detections})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
