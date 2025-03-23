import { useState, useRef } from "react";
import axios from "axios";

export default function Intrusion() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [noDetection, setNoDetection] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    setDetections([]);
    setNoDetection(false);

    drawBoundingBoxes(imageUrl, []);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5000/detect-intrusion", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const detectionsData = response.data.detections;
      setDetections(detectionsData);

      if (detectionsData.length === 0) {
        setNoDetection(true);
      }

      drawBoundingBoxes(imageUrl, detectionsData);
    } catch (error) {
      console.error("Detection failed:", error);
      setDetections([]);
      setNoDetection(true);
    } finally {
      setLoading(false);
    }
  };

  const drawBoundingBoxes = (imageUrl, detections) => {
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const maxWidth = 400;
      const scale = maxWidth / image.width;
      const newWidth = maxWidth;
      const newHeight = image.height * scale;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, newWidth, newHeight);

      detections.forEach((detection) => {
        const [x1, y1, x2, y2] = detection.bounding_box;

        const scaledX1 = x1 * scale;
        const scaledY1 = y1 * scale;
        const scaledX2 = x2 * scale;
        const scaledY2 = y2 * scale;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);

        ctx.fillStyle = "red";
        ctx.font = "14px Arial";
        ctx.fillText(`${detection.class_name} (${(detection.confidence * 100).toFixed(2)}%)`, scaledX1, scaledY1 - 5);
      });
    };
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center py-16">
      <h1 className="text-4xl font-bold text-green-400">Intrusion Detection</h1>
      <p className="text-gray-300 mt-3">Upload an image to detect intrusions using AI.</p>

      <label className="mt-6 bg-green-500 text-black px-6 py-3 rounded-lg cursor-pointer hover:bg-green-600">
        Upload Image
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>

      {loading && <p className="text-yellow-400 mt-4">Processing image...</p>}

      <div className="relative mt-6">
        {uploadedImage && (
          <>
            <img ref={imageRef} src={uploadedImage} alt="Uploaded" className="hidden" />
            <canvas ref={canvasRef} className="rounded-lg shadow-lg max-w-full" />
          </>
        )}
      </div>

      {detections.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg w-80">
          <h2 className="text-lg font-semibold text-green-400">Detected Objects:</h2>
          <ul className="text-gray-300">
            {detections.map((d, index) => (
              <li key={index} className="mt-2">
                {d.class_name} - {(d.confidence * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            onClick={() => {
              setUploadedImage(null);
              setDetections([]);
              setNoDetection(false);
            }}
          >
            Clear Image
          </button>
        </div>
      )}

      {noDetection && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg w-80">
          <h2 className="text-lg font-semibold text-red-400">No detection found.</h2>
          <button
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            onClick={() => {
              setUploadedImage(null);
              setDetections([]);
              setNoDetection(false);
            }}
          >
            Clear Image
          </button>
        </div>
      )}
    </div>
  );
}