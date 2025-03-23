import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true); //firebase checking for user
  const [user, setUser] = useState(null); //stores current logged in user

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => { // checking for logged in user
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>; 

  return user ? children // if logged in access to all component
  : <Navigate to="/login" />; // if not logged in redirect to login page
}
