// src/pages/SellItemPage.jsx
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import itemService from "../services/item.service";
import categoryService from "../services/category.service";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function SellItemPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    department: "",
    condition: "used",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      setAuthError("Please login to list items for sale.");
      setLoadingCats(false);
      return;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, category: data[0]._id }));
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoadingCats(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("department", formData.department);
      data.append("condition", formData.condition);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await itemService.createItem(data);
      alert("Item posted successfully!");

      setFormData({
        title: "",
        description: "",
        price: "",
        category: categories.length > 0 ? categories[0]._id : "",
        department: "",
        condition: "used",
        image: null,
      });
      navigate("/student");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to post item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border p-8 md:p-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Sell Your Item
        </h1>
        <p className="text-gray-500 mb-10">
          Fill in the details below to list your item on the AASTU Marketplace.
        </p>

        {authError && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {authError}{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Go to login
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">
                Item Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What are you selling?"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">
                Price (ETB)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter amount"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">
                Category
              </label>
              {loadingCats ? (
                <div className="h-[52px] bg-gray-50 rounded-xl flex items-center px-4">
                  <Loader2
                    className="animate-spin text-blue-500 mr-2"
                    size={18}
                  />
                  <span className="text-sm text-gray-400">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                  {categories.length === 0 && (
                    <option value="">No categories available</option>
                  )}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Software Engineering"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          {/* Item Condition */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-gray-700">
              Item Condition
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, condition: "new" })}
                className={`flex-1 py-3 px-6 rounded-xl font-bold border-2 transition ${
                  formData.condition === "new"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, condition: "used" })}
                className={`flex-1 py-3 px-6 rounded-xl font-bold border-2 transition ${
                  formData.condition === "used"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                Used
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Provide details about the item's features, quality, etc."
              className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">
              Upload Image
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 transition cursor-pointer relative">
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-gray-400">
                {formData.image ? (
                  <span className="text-blue-600 font-bold">
                    {formData.image.name}
                  </span>
                ) : (
                  <span>Click to upload or drag and drop</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || categories.length === 0 || !!authError}
            className={`mt-4 bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform hover:-translate-y-0.5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Listing Item..." : "List Item for Sale"}
          </button>
        </form>
      </div>
      <div className="w-full mt-10">
        <Footer />
      </div>
    </div>
  );
}

export default SellItemPage;
