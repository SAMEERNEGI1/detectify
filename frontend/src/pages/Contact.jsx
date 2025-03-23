import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        "service_npyr87u", // Service ID
        "template_m4mwo5e", // Template ID
        formData,
        "l1cH8JhJBRHjZMkDd" // Public Key
      );
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("Failed to send message. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-green-400 text-center">Contact Us</h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-[#0F172A] rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-[#0F172A] rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-[#0F172A] rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-green-500 text-black p-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Send Message
          </button>
        </form>
        {status && <p className="text-center mt-4 text-lg font-semibold">{status}</p>}
      </div>
    </div>
  );
}
