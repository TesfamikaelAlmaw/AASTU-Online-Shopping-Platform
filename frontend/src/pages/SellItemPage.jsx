// src/pages/SellItemPage.jsx
import React, { useState } from "react";
import Footer from "../components/Footer";
import itemService from "../services/item.service";
import { useNavigate } from "react-router-dom";

function SellItemPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Book",
    // department is not in backend Item entity yet, but keeping for UI
    department: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ["Book", "Electronics", "Clothes", "Furniture"];

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
      // Backend expects price as number
      const itemData = {
        ...formData,
        price: Number(formData.price),
      };
      
      // If image is selected, we might need FormData. 
      // For now, sending as JSON (omitting image if it's a File) 
      // as backend doesn't seem to have file upload logic shown yet.
      if (itemData.image instanceof File) {
        delete itemData.image;
        // In a real app, you'd upload this to S3/Cloudinary and send the URL
      }

      await itemService.createItem(itemData);
      alert("Item posted successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "Book",
        department: "",
        image: null,
      });
      navigate("/student");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to post item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Sell Your Item</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 w-full max-w-lg flex flex-col gap-4"
      >
        <label className="flex flex-col">
          Item Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter item title"
            className="border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="flex flex-col">
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter item description"
            className="border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="flex flex-col">
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price in ETB"
            className="border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="flex flex-col">
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded p-2 mt-1"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          Department:
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter your department"
            className="border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="flex flex-col">
          Upload Image:
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mt-1"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-500 text-white py-2 rounded hover:bg-green-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "Submitting..." : "Submit Item"}
        </button>
      </form>
	  <Footer/>
    </div>
  );
}

export default SellItemPage;
