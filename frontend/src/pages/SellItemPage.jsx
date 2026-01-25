// src/pages/SellItemPage.jsx
import React, { useState } from "react";
import Footer from "../components/Footer";

function SellItemPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Book",
    department: "",
    image: null,
  });

  const categories = ["Book", "Electronics", "Clothes", "Furniture"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Item submitted:", formData);
    alert("Item submitted! (Check console for data)");
    // Reset form
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "Book",
      department: "",
      image: null,
    });
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
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Submit Item
        </button>
      </form>
	  <Footer/>
    </div>
  );
}

export default SellItemPage;
