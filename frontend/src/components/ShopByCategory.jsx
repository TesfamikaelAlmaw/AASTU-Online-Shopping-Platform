import React from "react";
import { Book, Laptop, Shirt, Sofa, Gamepad2, Headphones } from "lucide-react";

const categories = [
  {
    name: "Books",
    description: "Textbooks, novels, and academic materials",
    count: 156,
    link: "Browse Books →",
    icon: <Book size={28} />,
    color: "bg-blue-500",
  },
  {
    name: "Electronics",
    description: "Laptops, phones, and gadgets",
    count: 89,
    link: "Browse Electronics →",
    icon: <Laptop size={28} />,
    color: "bg-purple-500",
  },
  {
    name: "Clothing",
    description: "Fashion and accessories",
    count: 234,
    link: "Browse Clothing →",
    icon: <Shirt size={28} />,
    color: "bg-pink-500",
  },
  {
    name: "Furniture",
    description: "Dorm and apartment essentials",
    count: 67,
    link: "Browse Furniture →",
    icon: <Sofa size={28} />,
    color: "bg-green-500",
  },
  {
    name: "Gaming",
    description: "Consoles, games, and accessories",
    count: 45,
    link: "Browse Gaming →",
    icon: <Gamepad2 size={28} />,
    color: "bg-red-500",
  },
  {
    name: "Audio",
    description: "Headphones, speakers, and music gear",
    count: 78,
    link: "Browse Audio →",
    icon: <Headphones size={28} />,
    color: "bg-orange-500",
  },
];

export default function ShopByCategory() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-2">Shop by Category</h2>
      <p className="text-center text-gray-600 mb-10">
        Discover items from different categories tailored for student needs
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 relative flex flex-col"
          >
            {/* Badge */}
            <span className="absolute top-4 right-4 bg-green-400 text-white text-sm px-3 py-1 rounded-full shadow">
              {cat.count} items
            </span>

            {/* Icon */}
            <div
              className={`${cat.color} w-12 h-12 flex items-center justify-center text-white rounded-lg mb-4`}
            >
              {cat.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold">{cat.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{cat.description}</p>

            {/* Link */}
            <a
              href="#"
              className="text-blue-600 font-medium hover:underline mt-auto"
            >
              {cat.link}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
