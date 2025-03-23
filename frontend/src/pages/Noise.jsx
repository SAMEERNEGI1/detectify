import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function NoiseDetector() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = sendAudioToBackend;
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const sendAudioToBackend = async () => {
    setLoading(true);
    setResult(null);
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await axios.post("http://localhost:5000/analyze-noise", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setResult({ error: "Failed to analyze noise." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center py-16">
      <h1 className="text-4xl font-bold text-green-400">Noise Pollution Detector</h1>
      <p className="text-gray-300 mt-3">Record noise and analyze its impact.</p>

      {!recording ? (
        <button
          onClick={startRecording}
          className="mt-6 bg-green-500 text-black px-6 py-3 rounded-lg cursor-pointer hover:bg-green-600"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-red-600"
        >
          Stop Recording
        </button>
      )}

      {loading && <p className="mt-4 text-gray-400 animate-pulse">Analyzing...</p>}

      {result && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
          {result.error ? (
            <p className="text-red-400">{result.error}</p>
          ) : (
            <>
              <p className="text-xl text-green-400 font-bold">🔹 Noise Level: {result.decibel} dB</p>
              <p className="text-gray-300 mt-2">🛑 Risk Level: {result.riskLevel}</p>
              <p className="text-gray-400 mt-2">📢 Advice: {result.advice}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
