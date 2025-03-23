import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      navigate("/");
      toast.success("logged in") // Redirect to home after login
    } catch (err) {
      setError("Invalid email or password.");
      toast.error("login failed!")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-green-400 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300">Email or Phone</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-[#0F172A] rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-[#0F172A] rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-green-500 text-black p-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don't have an account? {" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
