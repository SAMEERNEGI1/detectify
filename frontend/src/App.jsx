import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Intrusion from "./pages/Intrusion";
import LicensePlate from "./pages/LicensePlate";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivateRoute from "./components/PrivateRoute";
import Noise from "./pages/Noise";
import Air from "./pages/Air";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000}/>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/intrusion"
          element={
            <PrivateRoute>
              <Intrusion />
            </PrivateRoute>
          }
        />
        <Route
          path="/license"
          element={
            <PrivateRoute>
              <LicensePlate />
            </PrivateRoute>
          }
        />
        <Route
          path="/noise"
          element={
            <PrivateRoute>
              <Noise/>
            </PrivateRoute>
          }
          />
          <Route
          path="/air"
          element={
            <PrivateRoute>
              <Air/>
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
