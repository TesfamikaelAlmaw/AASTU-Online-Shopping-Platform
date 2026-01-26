import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, MapPin, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import itemService from "../services/item.service";
import categoryService from "../services/category.service";

function LatestItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, catsData] = await Promise.all([
          itemService.getAllItems(),
          categoryService.getAllCategories()
        ]);
        setItems(itemsData);
        setCategories(["All", ...catsData.map(c => c.name)]);
      } catch (error) {
        console.error("Failed to fetch latest items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category?.name === selectedCategory);

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
          {loading ? (
             <div className="col-span-full flex justify-center py-12">
               <Loader2 className="animate-spin text-blue-500" size={32} />
             </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* Image */}
                <Link to={`/item/${item._id}`}>
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full w-fit mb-2">
                    {item.category?.name || "Other"}
                  </span>

                  <Link to={`/item/${item._id}`} className="hover:text-blue-600 transition">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-green-600 font-bold mb-2">${item.price}</p>

                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.owner_id?.department || "AASTU"}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>

                  <Link to={`/view-profile/${item.owner_id?._id}`} className="hover:underline">
                    <p className="text-sm text-gray-700 mt-2 flex-1">
                      by {item.owner_id?.full_name || "Unknown"}
                    </p>
                  </Link>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Heart className="w-5 h-5 text-gray-500" />
                    </button>
                    <Link 
                      to={`/item/${item._id}`}
                      className="flex items-center text-sm text-gray-700 hover:text-green-600"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" /> View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full text-center text-gray-500 py-12">
                No items found in this category.
             </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestItems;
