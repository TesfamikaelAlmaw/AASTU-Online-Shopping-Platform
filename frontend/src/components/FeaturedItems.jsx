import React from "react";
import { Heart, Eye, MessageCircle } from "lucide-react";

const featuredItems = [
  {
    title: "MacBook Pro 13\" M1 2021",
    price: "$899",
    category: "Electronics",
    condition: "like-new",
    seller: "Sarah Johnson",
    dept: "Computer Science",
    likes: 24,
    views: 156,
  },
  {
    title: "Data Structures & Algorithms Textbook",
    price: "$45",
    category: "Books",
    condition: "used",
    seller: "Mike Chen",
    dept: "Software Engineering",
    likes: 12,
    views: 89,
  },
  {
    title: "Gaming Chair - Almost New",
    price: "$120",
    category: "Furniture",
    condition: "like-new",
    seller: "Alex Rivera",
    dept: "Information Systems",
    likes: 18,
    views: 134,
  },
  {
    title: "iPhone 13 - Excellent Condition",
    price: "$650",
    category: "Electronics",
    condition: "used",
    seller: "Emma Wilson",
    dept: "IT",
    likes: 31,
    views: 203,
  },
];

export default function FeaturedItems() {
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
        {featuredItems.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 flex flex-col relative"
          >
            {/* Condition Badge */}
            <span
              className={`absolute top-3 left-3 px-3 py-1 text-sm rounded-full text-white ${
                item.condition === "like-new" ? "bg-blue-600" : "bg-gray-600"
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
              <span className="text-gray-400 text-sm">Image</span>
            </div>

            {/* Title & Price */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-blue-600 font-bold">{item.price}</p>
            </div>

            {/* Category */}
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mb-3 inline-block">
              {item.category}
            </span>

            {/* Seller Info */}
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
              <div>
                <p className="text-sm font-medium">{item.seller}</p>
                <p className="text-xs text-gray-500">{item.dept}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Heart size={16} /> {item.likes}
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} /> {item.views}
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
