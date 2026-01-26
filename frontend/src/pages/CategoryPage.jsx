import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import itemService from "../services/item.service";
import { Loader2 } from "lucide-react";

function CategoryPage() {
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("name") || "Other";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const allItems = await itemService.getAllItems();
        // Filter by category name (case insensitive)
        const filtered = allItems.filter(item => 
          item.category?.name?.toLowerCase() === categoryName.toLowerCase() ||
          (categoryName === "Other" && !item.category)
        );
        setItems(filtered);
      } catch (error) {
        console.error("Failed to fetch categorized items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [categoryName]);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 w-full min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Category: {categoryName}</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder={`Search ${categoryName}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full mb-6"
      />

      {/* Items */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <div className="flex justify-between items-center mt-1">
                   <p className="text-sm text-gray-500">{item.owner_id?.department || "AASTU"}</p>
                   <p className="text-blue-600 font-bold">${item.price}</p>
                </div>
                <p className="text-gray-700 mt-2 text-sm line-clamp-3">{item.description}</p>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                   <span className="text-xs text-gray-400">Sold by: {item.owner_id?.full_name}</span>
                   <button className="text-blue-600 text-sm font-semibold hover:underline">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No items found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
