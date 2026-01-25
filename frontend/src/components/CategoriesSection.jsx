import React from "react";
import { BookOpen, Laptop, Shirt, Home, Utensils, MoreHorizontal } from "lucide-react";

function CategoriesSection() {
  const categories = [
    { name: "Books & Academic", icon: <BookOpen className="w-8 h-8 text-green-600" />, bg: "bg-green-100" },
    { name: "Electronics", icon: <Laptop className="w-8 h-8 text-blue-600" />, bg: "bg-blue-100" },
    { name: "Fashion", icon: <Shirt className="w-8 h-8 text-yellow-500" />, bg: "bg-yellow-100" },
    { name: "Furniture", icon: <Home className="w-8 h-8 text-green-500" />, bg: "bg-green-100" },
    { name: "Food & Snacks", icon: <Utensils className="w-8 h-8 text-red-500" />, bg: "bg-red-100" },
    { name: "More", icon: <MoreHorizontal className="w-8 h-8 text-gray-500" />, bg: "bg-gray-100" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Shop by Category</h2>
        <p className="text-gray-600 mb-10">
          Find exactly what you need from our popular categories
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${cat.bg}`}>
                {cat.icon}
              </div>
              <p className="font-medium text-sm md:text-base">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
