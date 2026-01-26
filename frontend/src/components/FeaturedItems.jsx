import React, { useState, useEffect } from "react";
import { Heart, Eye, MessageCircle, Loader2 } from "lucide-react";
import itemService from "../services/item.service";

export default function FeaturedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getAllItems();
        // Just take the first 4 for "featured"
        setItems(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured items", error);
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
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>

            {/* Title & Price */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm truncate pr-2">{item.title}</h3>
              <p className="text-blue-600 font-bold">${item.price}</p>
            </div>

            {/* Category */}
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mb-3 inline-block">
              {item.category?.name || "Uncategorized"}
            </span>

            {/* Seller Info */}
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs font-bold text-gray-500">
                {item.owner_id?.full_name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium">{item.owner_id?.full_name || "Unknown Seller"}</p>
                <p className="text-xs text-gray-500">{item.owner_id?.department || "AASTU"}</p>
              </div>
            </div>

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
            <button className="mt-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition">
              <MessageCircle size={18} /> Contact Seller
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
