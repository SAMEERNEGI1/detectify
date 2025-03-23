import { useState } from "react";
import axios from "axios";

export default function LicensePlate() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("image", file);

      setLoading(true);
      setResult(null); 

      try {
        const response = await axios.post("http://localhost:5000/detect-license", formData);
        

        if (response.data.plate) {
          setResult({
            plate: response.data.plate || "Unknown",
            region: response.data.region || "Asia",
            type: response.data.type || "Vehicle",
            confidence: response.data.confidence || "N/A",
          });
        } else {
          setResult({ error: "No license plate detected." });
        }
      } catch (error) {
        setResult({ error: "Error processing image." });
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center py-16">
      <h1 className="text-4xl font-bold text-green-400">License Plate Detection</h1>
      <p className="text-gray-300 mt-3">Upload an image of a vehicle's license plate for detection.</p>

      <label className="mt-6 bg-green-500 text-black px-6 py-3 rounded-lg cursor-pointer hover:bg-green-600">
        Upload Image
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>

      {uploadedImage && (
        <div className="mt-6">
          <img src={uploadedImage} alt="Uploaded" className="w-80 h-auto rounded-lg shadow-lg" />
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <p className="mt-4 text-gray-400 animate-pulse">Processing...</p>}

      {/* Display Result */}
      {result && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
          {result.error ? (
            <p className="text-red-400">{result.error}</p>
          ) : (
            <>
              <p className="text-xl text-green-400 font-bold">🔹 Detected Plate: {result.plate}</p>
              <p className="text-gray-300 mt-2">📍 Region: {result.region}</p>
              <p className="text-gray-300">🚙 Vehicle Type: {result.type}</p>
              <p className="text-gray-400 mt-2">🧐 Confidence: {result.confidence}</p>
            </>
          )}
        </div>
      )}

      {/* Clear Image Button (Only shows after result is displayed) */}
      {result && (
        <button
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          onClick={() => {
            setUploadedImage(null);
            setResult(null);
          }}
        >
          Clear Image
        </button>
      )}
    </div>
  );
}
