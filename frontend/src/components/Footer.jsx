// src/components/Footer.jsx
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-600">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-green-600 font-semibold text-lg">AASTU Exchange</h2>
          <p className="mt-2">
            The trusted marketplace for AASTU university students. 
            Safe, secure, and community-focused.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-green-600">Browse Items</a></li>
            <li><a href="#" className="hover:text-green-600">Post Item</a></li>
            <li><a href="#" className="hover:text-green-600">Categories</a></li>
            <li><a href="#" className="hover:text-green-600">How It Works</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-green-600">Help Center</a></li>
            <li><a href="#" className="hover:text-green-600">Safety Guidelines</a></li>
            <li><a href="#" className="hover:text-green-600">Contact Admin</a></li>
            <li><a href="#" className="hover:text-green-600">Report Item</a></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Community</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-green-600">Terms of Service</a></li>
            <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-green-600">Community Rules</a></li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4 text-gray-500">
            <a href="#" className="hover:text-green-600"><FaFacebookF /></a>
            <a href="#" className="hover:text-green-600"><FaInstagram /></a>
            <a href="#" className="hover:text-green-600"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t text-center py-4 text-gray-500 text-sm">
        © 2025 AASTU Exchange Hub. Built for the AASTU community.
      </div>
    </footer>
  );
}
export default Footer;