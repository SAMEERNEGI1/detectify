import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Ensure Firebase is imported
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function Signup() {
  //stores user data
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {// handles user data dynamic when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();// prevent loading of page
    setError("");

    try {
      // Sign up user with Firebase Authentication
      await createUserWithEmailAndPassword(auth, formData.email, formData.password); // firebase api call for creating user with user info
      
      // Redirect to home page after successful signup
      navigate("/login");
      toast.success("Account created, Login again!")
    } catch (error) {
      setError(error.message);
      toast.error("Signup failed! Try again")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-green-400 text-center">Sign Up</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
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
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
