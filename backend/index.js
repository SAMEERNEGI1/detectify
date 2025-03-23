import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

let ffmpeg, fetchFile;

async function loadFFmpeg() {
  if (!ffmpeg) {
    try {
      const ffmpegModule = await import("@ffmpeg/ffmpeg");
      ffmpeg = ffmpegModule.default.createFFmpeg({ log: true });
      fetchFile = ffmpegModule.default.fetchFile;
      await ffmpeg.load();
      console.log("✅ FFmpeg Loaded Successfully!");
    } catch (error) {
      console.error("❌ FFmpeg Loading Error:", error);
      throw new Error("FFmpeg initialization failed.");
    }
  }
}

// 🔹 Intrusion Detection Route
app.post("/detect-intrusion", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image provided." });

    const formData = new FormData();
    formData.append("image", req.file.buffer, { filename: "upload.jpg" });

    const response = await axios.post("http://127.0.0.1:5001/detect", formData, {
      headers: { ...formData.getHeaders() },
    });

    return res.json(response.data);
  } catch (error) {
    console.error("❌ Intrusion Detection Error:", error);
    return res.status(500).json({ message: "Intrusion detection failed.", error: error.message });
  }
});

// 🔹 License Plate Detection Route
app.post("/detect-license", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image provided." });

    const formData = new FormData();
    formData.append("upload", req.file.buffer, { filename: "plate.jpg" });
    formData.append("regions", "us");

    const response = await axios.post("https://api.platerecognizer.com/v1/plate-reader/", formData, {
      headers: {
        Authorization: `Token ${process.env.PLATE_RECOGNIZER_API_TOKEN}`,
        ...formData.getHeaders(),
      },
    });

    const results = response.data.results;
    if (!results || results.length === 0) return res.json({ message: "No license plate detected." });

    const plateData = results[0];
    const vehicle = plateData.vehicle || {};

    return res.json({
      plate: plateData.plate || "Unknown",
      region: plateData.region?.code || "Asia",
      confidence: plateData.score ? `${(plateData.score * 100).toFixed(2)}%` : "N/A",
      type: vehicle.type || "Vehicle",
    });
  } catch (error) {
    console.error("❌ License Plate Detection Error:", error);
    return res.status(500).json({ message: "License plate detection failed.", error: error.message });
  }
});

// 🔹 Air Pollution Detection Route
app.post("/detect-air", async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if (!lat || !lon) return res.status(400).json({ message: "Latitude and longitude are required." });

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    return res.json(response.data);
  } catch (error) {
    console.error("❌ Air Pollution Detection Error:", error);
    return res.status(500).json({ message: "Failed to fetch air quality data.", error: error.message });
  }
});

// 🔹 Noise Pollution Detection Route
app.post("/analyze-noise", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No audio file provided." });

    await loadFFmpeg(); // Ensure FFmpeg is loaded

    console.log("🔍 Processing audio file...");
    ffmpeg.FS("writeFile", "audio.wav", await fetchFile(req.file.buffer));

    const { stderr } = await ffmpeg.run("-i", "audio.wav", "-af", "volumedetect", "-f", "null", "-");
    console.log("📝 FFmpeg Output:", stderr);

    const match = stderr.match(/max_volume: (-?\d+\.\d+) dB/);
    const decibel = match ? Math.abs(parseFloat(match[1])) : "Unknown";

    let riskLevel = "Unknown";
    let advice = "Could not determine noise level.";

    if (decibel !== "Unknown") {
      if (decibel <= 50) {
        riskLevel = "Low (Safe)";
        advice = "This noise level is safe and unlikely to cause harm.";
      } else if (decibel <= 70) {
        riskLevel = "Moderate (Mild Disturbance)";
        advice = "Long exposure may cause minor irritation. Consider lowering the volume.";
      } else if (decibel <= 90) {
        riskLevel = "High (Potentially Harmful)";
        advice = "Prolonged exposure can be damaging. Use ear protection if needed.";
      } else {
        riskLevel = "Severe (Hearing Risk)";
        advice = "This noise level is dangerous! Avoid prolonged exposure.";
      }
    }

    return res.json({ decibel, riskLevel, advice });
  } catch (error) {
    console.error("❌ Noise Pollution Analysis Error:", error);
    return res.status(500).json({ message: "Noise pollution analysis failed.", error: error.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
