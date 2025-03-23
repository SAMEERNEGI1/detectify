import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1E293B] text-gray-300 text-center py-3 mt-6">
      <div className="container mx-auto">
        <p className="text-lg font-semibold text-green-400">Detectify</p>
        <nav className="flex justify-center space-x-6 mt-1">
          <Link to="/" className="hover:text-green-500">Home</Link>
          <Link to="/about" className="hover:text-green-500">About</Link>
          <Link to="/contact" className="hover:text-green-500">Contact</Link>
        </nav>
        <p className="text-sm text-gray-500 mt-2">© 2025 Detectify. All rights reserved.</p>
      </div>
    </footer>
  );
}

