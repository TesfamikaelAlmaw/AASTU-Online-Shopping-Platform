import React, { useState, useEffect } from "react";
import {
  Book,
  Laptop,
  Shirt,
  Sofa,
  Gamepad2,
  Headphones,
  Loader2,
} from "lucide-react";
import categoryService from "../services/category.service";

const iconMap = {
  Book: <Book size={28} />,
  Electronics: <Laptop size={28} />,
  Clothes: <Shirt size={28} />,
  Furniture: <Sofa size={28} />,
  Gaming: <Gamepad2 size={28} />,
  Audio: <Headphones size={28} />,
};

const colorMap = {
  Book: "bg-blue-500",
  Electronics: "bg-purple-500",
  Clothes: "bg-pink-500",
  Furniture: "bg-green-500",
  Gaming: "bg-red-500",
  Audio: "bg-orange-500",
};

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setError(error.response?.data?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
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
      <h2 className="text-3xl font-bold text-center mb-2">Shop by Category</h2>
      <p className="text-center text-gray-600 mb-10">
        Discover items from different categories tailored for student needs
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      {!error && categories.length === 0 && (
        <div className="text-center text-gray-500 mb-6">
          No categories available yet.
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 relative flex flex-col"
          >
            {/* Icon */}
            <div
              className={`${colorMap[cat.name] || "bg-gray-500"} w-12 h-12 flex items-center justify-center text-white rounded-lg mb-4`}
            >
              {iconMap[cat.name] || <Book size={28} />}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold">{cat.name}</h3>
            <p className="text-gray-600 text-sm mb-4">
              {cat.description || `Browse all ${cat.name} items.`}
            </p>

            {/* Link */}
            <a
              href={`/category?name=${cat.name}`}
              className="text-blue-600 font-medium hover:underline mt-auto"
            >
              Browse {cat.name} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
