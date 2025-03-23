import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center py-16 px-6">
      {/* Title with Animation */}
      <motion.h1 
        className="text-4xl font-bold text-green-400 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Detectify
      </motion.h1>

      {/* Description */}
      <motion.p 
        className="text-lg text-gray-300 max-w-3xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Detectify is an AI-powered object detection system specializing in **intrusion detection** and **license plate recognition**. 
        It leverages deep learning models to analyze images and provide real-time insights for enhanced security and monitoring.
      </motion.p>

      {/* Features Section */}
      <motion.div 
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Feature Cards */}
        {[
          { title: "Intrusion Detection", desc: "Detect unauthorized activities using AI-powered image analysis." },
          { title: "License Plate Recognition", desc: "Identify vehicle license plates with high accuracy for security purposes." },
          { title: "Real-Time Processing", desc: "Get instant results with optimized AI models running in milliseconds." },
          { title: "User-Friendly Interface", desc: "Minimalistic design ensuring smooth user experience for all users." },
        ].map((feature, index) => (
          <motion.div 
            key={index}
            className="bg-[#1E293B] p-6 rounded-lg shadow-lg border border-gray-600 hover:border-green-500 transition"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl font-semibold text-green-300">{feature.title}</h2>
            <p className="text-gray-400 mt-2">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Extra Section for More Info */}
      <motion.div 
        className="mt-12 max-w-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-green-300">How It Works</h2>
        <p className="text-gray-400 mt-3">
          Upload an image, and our AI will analyze it for **intrusion detection** or **license plate recognition**.
          The results are displayed instantly, making security monitoring seamless and efficient.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <a 
          href="https://www.fortinet.com/resources/cyberglossary/intrusion-detection-system"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Learn More
        </a>
      </motion.div>

      {/* Footer */}
      <p className="text-gray-400 text-sm mt-10">Built with ❤️ by Conor</p>
    </div>
  );
}
