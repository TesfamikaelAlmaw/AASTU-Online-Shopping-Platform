import React, { useState, useEffect } from "react";
import { Heart, Eye, MessageCircle, Loader2 } from "lucide-react";
import itemService from "../services/item.service";
import { Link } from "react-router-dom";
export default function FeaturedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getAllItems();
        // Just take the first 4 for "featured"
        setItems(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured items", error);
        setError(
          error.response?.data?.message || "Failed to load featured items",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Featured Items</h2>
          <p className="text-gray-600">Handpicked deals from trusted sellers</p>
        </div>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
          View All Items
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="text-center text-gray-500 mb-6">
          No items available yet.
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 flex flex-col relative"
          >
            {/* Condition Badge */}
            <span
              className={`absolute top-3 left-3 px-3 py-1 text-sm rounded-full text-white ${
                item.condition === "new" ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              {item.condition}
            </span>

            {/* Favorite button */}
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <Heart size={20} />
            </button>

            {/* Image Placeholder */}
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>

            {/* Title & Price */}
            <Link
              to={`/item/${item._id}`}
              className="block hover:text-blue-600 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm truncate pr-2">
                  {item.title}
                </h3>
                <p className="text-blue-600 font-bold">${item.price}</p>
              </div>
            </Link>

            {/* Category */}
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mb-3 inline-block">
              {item.category?.name || "Uncategorized"}
            </span>

            {/* Seller Info */}
            <Link
              to={`/view-profile/${item.owner_id?._id}`}
              className="block hover:bg-gray-50 rounded-lg p-1 transition"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs font-bold text-gray-500">
                  {item.owner_id?.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {item.owner_id?.full_name || "Unknown Seller"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.owner_id?.department || "AASTU"}
                  </p>
                </div>
              </div>
            </Link>

            {/* Stats (Placeholders for now) */}
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Heart size={16} /> {Math.floor(Math.random() * 50)}
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} /> {Math.floor(Math.random() * 200)}
              </div>
            </div>

            {/* Contact Button */}
            <Link
              to={`/item/${item._id}`}
              className="mt-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              <MessageCircle size={18} /> View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
