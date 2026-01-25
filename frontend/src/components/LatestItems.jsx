import React, { useState } from "react";
import { Heart, MessageCircle, MapPin, Clock } from "lucide-react";

const items = [
  {
    id: 1,
    title: "Engineering Mathematics Textbook - Brand New",
    category: "Books",
    price: "800 ETB",
    location: "Block 4, AASTU",
    time: "2 hours ago",
    author: "Sarah M.",
    image: "/items/book.jpg",
  },
  {
    id: 2,
    title: "HP Laptop - Perfect for CS Students",
    category: "Electronics",
    price: "12,000 ETB",
    location: "Block 2, AASTU",
    time: "5 hours ago",
    author: "John D.",
    image: "/items/laptop.jpg",
  },
  {
    id: 3,
    title: "Scientific Calculator TI-84",
    category: "Electronics",
    price: "1,200 ETB",
    location: "Block 1, AASTU",
    time: "1 day ago",
    author: "Mike R.",
    image: "/items/calculator.jpg",
  },
  {
    id: 4,
    title: "University Hoodie - Size M",
    category: "Fashion",
    price: "450 ETB",
    location: "Block 3, AASTU",
    time: "3 hours ago",
    author: "Emma K.",
    image: "/items/hoodie.jpg",
  },
];

const categories = ["All", "Books", "Electronics", "Fashion", "Furniture"];

function LatestItems() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Latest Items</h2>
            <p className="text-gray-500">{items.length} items available</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="h-48 w-full object-cover"
              />

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full w-fit mb-2">
                  {item.category}
                </span>

                <h3 className="font-semibold text-gray-800 mb-1">
                  {item.title}
                </h3>

                <p className="text-green-600 font-bold mb-2">{item.price}</p>

                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.time}
                </div>

                <p className="text-sm text-gray-700 mt-2 flex-1">
                  by {item.author}
                </p>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Heart className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="flex items-center text-sm text-gray-700 hover:text-green-600">
                    <MessageCircle className="w-4 h-4 mr-1" /> Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestItems;
