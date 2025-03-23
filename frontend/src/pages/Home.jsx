import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white">
      
      <div className="flex-1 flex flex-col items-center px-6 pt-24 pb-16"> 
        
        <header className="text-center animate-fadeIn">
          <h1 className="text-6xl font-bold text-green-400">Welcome to Detectify</h1>
          <p className="text-gray-300 mt-5 max-w-2xl text-xl">
            AI-powered security detection for intrusion, license plate recognition, and image scanning.
          </p>
          <Link to="/intrusion" className="mt-8 inline-block bg-green-500 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition">
            Get Started
          </Link>
        </header>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className="bg-[#1E293B] p-8 rounded-xl text-center shadow-lg hover:scale-105 transition transform duration-300"
            >
              <div className="text-6xl mb-4">{section.icon}</div>
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="text-gray-400 mt-3 text-base">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const sections = [
  { id: 1, title: "Intrusion Detection", path: "/intrusion", description: "Detect unauthorized access in real-time.", icon: "🛡" },
  { id: 2, title: "License Plate Detection", path: "/license", description: "Identify and read vehicle plates instantly.", icon: "🚗" },
  { id: 3, title: "Noise detector", path: "/noise", description: "Detect the level of noise in the area.", icon: "🔍" },
  { id: 4, title: "Air Pollution Detector", path: "/air", description: "Check real-time air quality data.", icon: "🌍" },
];
