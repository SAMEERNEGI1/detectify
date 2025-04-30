import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Intrusion() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [noDetection, setNoDetection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("static"); // static or realtime

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (mode === "realtime") {
      startCamera();
    } else {
      stopCamera();
    }

    return stopCamera;
  }, [mode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
  
        // Start detection loop every 3s
        intervalRef.current = setInterval(() => {
          if (videoRef.current.readyState === 4) {
            captureFrameAndDetect();
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    clearInterval(intervalRef.current);
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrameAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;
  
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    canvas.toBlob(async (blob) => {
      if (!blob) return;
  
      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");
  
      console.log("Sending frame to backend...");
  
      // Log FormData to check if the image is appended correctly
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
  
      try {
        const response = await axios.post("http://localhost:5000/live-detect-intrusion", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        const detectionsData = response.data.detections;
        setDetections(detectionsData);
        drawOnCanvas(video, detectionsData);
      } catch (error) {
        console.error("Realtime detection error:", error);
      }
    }, "image/jpeg");
  };
  
  // Start continuously capturing and detecting frames at a regular interval
  const startContinuousDetection = () => {
    const intervalId = setInterval(() => {
      captureFrameAndDetect();
    }, 100); // Adjust the interval to control how often you capture a frame (100 ms = 10 fps)
  
    return intervalId; // You can clear this interval later if needed
  };
  
  // Stop continuous detection (if necessary)
  const stopContinuousDetection = (intervalId) => {
    clearInterval(intervalId);
  };
  
  // Start capturing frames when the component mounts
  useEffect(() => {
    const intervalId = startContinuousDetection();
  
    // Optionally stop capturing frames on component unmount
    return () => stopContinuousDetection(intervalId);
  }, []);
  

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl); // Update image reference
    setDetections([]); // Reset detections
    setNoDetection(false); // Reset no detections
    drawBoundingBoxes(imageUrl, []); // Draw empty canvas initially

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5000/detect-intrusion", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const detectionsData = response.data.detections;
      setDetections(detectionsData); // Set the detections

      if (detectionsData.length === 0) setNoDetection(true);

      drawBoundingBoxes(imageUrl, detectionsData); // Draw detections on canvas
    } catch (error) {
      console.error("Static detection failed:", error);
      setDetections([]);
      setNoDetection(true);
    } finally {
      setLoading(false);
    }
  };

  const drawOnCanvas = (source, detections) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = source.videoWidth || source.width;
    const height = source.videoHeight || source.height;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(source, 0, 0, width, height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.font = "14px Arial";
    ctx.fillStyle = "red";

    detections.forEach((detection) => {
      const [x1, y1, x2, y2] = detection.bounding_box;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillText(`${detection.class_name} (${(detection.confidence * 100).toFixed(1)}%)`, x1, y1 - 5);
    });
  };

  const drawBoundingBoxes = (imageUrl, detections) => {
    const image = new Image();
    image.src = imageUrl;
  
    image.onload = () => {
      // Resize the image to a medium size (500px width)
      const maxWidth = 500;
      const scaleFactor = maxWidth / image.width;
      const newWidth = maxWidth;
      const newHeight = image.height * scaleFactor;
  
      // Update the canvas size based on resized image
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
  
      canvas.width = newWidth;
      canvas.height = newHeight;
  
      // Draw the resized image on canvas
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
  
      // Draw bounding boxes and labels
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";
      ctx.font = "14px Arial";
      ctx.fillStyle = "red";
  
      detections.forEach((detection) => {
        const [x1, y1, x2, y2] = detection.bounding_box;
        // Scale bounding box coordinates to match resized image
        const scaledX1 = x1 * scaleFactor;
        const scaledY1 = y1 * scaleFactor;
        const scaledX2 = x2 * scaleFactor;
        const scaledY2 = y2 * scaleFactor;
  
        ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
        ctx.fillText(`${detection.class_name} (${(detection.confidence * 100).toFixed(1)}%)`, scaledX1, scaledY1 - 5);
      });
    };
  };
  

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center py-16">
      <h1 className="text-4xl font-bold text-green-400">Intrusion Detection</h1>
      <p className="text-gray-300 mt-3">Choose a mode to detect intrusions using AI.</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setMode("static")}
          className={`px-6 py-2 rounded-lg ${mode === "static" ? "bg-green-600" : "bg-green-500"} hover:bg-green-600`}
        >
          Static Image
        </button>
        <button
          onClick={() => setMode("realtime")}
          className={`px-6 py-2 rounded-lg ${mode === "realtime" ? "bg-blue-600" : "bg-blue-500"} hover:bg-blue-600`}
        >
          Realtime Camera
        </button>
      </div>

      {mode === "static" && (
        <label className="mt-6 bg-green-500 text-black px-6 py-3 rounded-lg cursor-pointer hover:bg-green-600">
          Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      )}

      {loading && <p className="text-yellow-400 mt-4">Processing image...</p>}

      <div className="relative mt-6">
        {mode === "static" && uploadedImage && (
          <>
            <img ref={imageRef} src={uploadedImage} alt="Uploaded" className="hidden" />
            <canvas ref={canvasRef} className="rounded-lg shadow-lg max-w-full" />
          </>
        )}

        {mode === "realtime" && (
          <>
            <video ref={videoRef} className="rounded-lg shadow-lg max-w-full" muted autoPlay playsInline />
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
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
        </div>
      )}

      {noDetection && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg w-80">
          <h2 className="text-lg font-semibold text-red-400">No detection found.</h2>
        </div>
      )}
    </div>
  );
}
