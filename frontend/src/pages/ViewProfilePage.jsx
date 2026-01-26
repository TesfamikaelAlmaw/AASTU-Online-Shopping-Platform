import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/user.service";
import itemService from "../services/item.service";
import { Loader2 } from "lucide-react";

function ViewProfilePage() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerPosts, setSellerPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!sellerId) return;
      setLoading(true);
      try {
        // Since view profile might be public, but userService.getUserById is admin role-guarded on backend...
        // I might need a public profile endpoint. 
        // For now, I'll attempt fetching all items and filtering to find the user if getUserById fails.
        let userData;
        try {
           userData = await userService.getUserById(sellerId);
        } catch (err) {
           // Fallback: try to find user info from items if it was populated
           const allItems = await itemService.getAllItems();
           const itemFromSeller = allItems.find(i => i.owner_id?._id === sellerId);
           if (itemFromSeller) userData = itemFromSeller.owner_id;
        }
        
        setSeller(userData);
        
        const allItems = await itemService.getAllItems();
        const posts = allItems.filter(item => item.owner_id?._id === sellerId);
        setSellerPosts(posts);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [sellerId]);

  if (loading) {
     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={48} /></div>;
  }

  if (!seller) {
     return <div className="flex justify-center items-center h-screen">User Not Found</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      {/* Seller Profile */}
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 mb-4">
           {seller.full_name?.charAt(0) || "U"}
        </div>
        <h2 className="text-2xl font-bold">{seller.full_name}</h2>
        <p className="text-gray-600">{seller.department || "AASTU Student"}</p>
        <p className="text-gray-500 mb-4">{seller.email}</p>
        <p className="text-gray-700 text-center">Member since {new Date(seller.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Seller Latest Posts */}
      <div className="w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-4">Latest Posts ({sellerPosts.length})</h3>
        {sellerPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellerPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-lg">{post.title}</h4>
                <p className="text-blue-600 font-bold">${post.price}</p>
                <p className="text-gray-500 text-sm">{post.category?.name || "Other"}</p>
                <p className="text-gray-700 mt-2 text-sm line-clamp-2">{post.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No posts found for this user.</p>
        )}
      </div>
    </div>
  );
}

export default ViewProfilePage;
