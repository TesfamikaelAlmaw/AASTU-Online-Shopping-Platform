import React, { useState } from "react";

function CategoryPage() {
  const [category, setCategory] = useState("Book");
  const [searchQuery, setSearchQuery] = useState("");

  // Fake data
  const items = [
    {
      id: 1,
      name: "Introduction to Algorithms",
      category: "Book",
      department: "Computer Science",
      description: "Classic algorithms reference book",
    },
    {
      id: 2,
      name: "Linear Algebra Done Right",
      category: "Book",
      department: "Mathematics",
      description: "Popular math book for students",
    },
    {
      id: 3,
      name: "Wireless Router",
      category: "Electronics",
      department: "Engineering",
      description: "High-speed WiFi router",
    },
    {
      id: 4,
      name: "Database System Concepts",
      category: "Book",
      department: "Information Technology",
      description: "Database fundamentals and SQL",
    },
  ];

  // Filter items by category + search query
  const filteredItems = items.filter(
    (item) =>
      item.category.toLowerCase() === category.toLowerCase() &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 w-full min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Category: {category}</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder={`Search ${category}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full mb-6"
      />

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.department}</p>
              <p className="text-gray-700 mt-2">{item.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No items found.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
