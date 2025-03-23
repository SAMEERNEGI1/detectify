import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // stores currently logged user
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      // dynamic change when user logs in and logout by subscribe and unsubscribe
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Logout handle function
  const handleLogout = async () => {
    try {
      await signOut(auth); // component from firebase api
      toast.info("Logged out successfully!");
      setShowLogoutConfirm(false);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed! Try again.");
    }
  };

  return (
    <nav className="bg-[#0F172A] text-white py-3 px-4 shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to={user ? "/" : "/login"}
          className="text-xl font-bold text-green-400"
        >
          Detectify
        </Link>

        {/* if user logged in then it shows this in navbar*/}
        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-300">
                Welcome, {user.email}
              </span>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                Logout
              </button>
            </>


          // if not logged in show this in navbar 
          ) : (
            <>
              <Link
                to="/login"
                className="bg-green-500 px-4 py-2 rounded-lg text-black hover:bg-green-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 px-4 py-2 rounded-lg text-black hover:bg-green-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#1E293B] py-4 flex flex-col items-center space-y-2 md:hidden">
          {user ? (
            <>
              <span className="text-sm text-gray-300">
                Welcome, {user.email}
              </span>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-green-500 px-4 py-2 rounded-lg text-black hover:bg-green-600"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 px-4 py-2 rounded-lg text-black hover:bg-green-600"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      {/* when user clicks on logout button it display confirmation.. */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-800">Confirm Logout</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-between w-full">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 w-1/2 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-1/2 ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
