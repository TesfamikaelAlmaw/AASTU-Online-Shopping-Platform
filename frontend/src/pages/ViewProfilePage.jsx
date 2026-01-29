import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import userService from "../services/user.service";
import itemService from "../services/item.service";
import authService from "../services/auth.service";
import {
  Loader2,
  MessageCircle,
  ShoppingBag,
  Calendar,
  Mail,
  Settings,
  Edit,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ViewProfilePage() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerPosts, setSellerPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getCurrentUser();
  const isOwnProfile =
    currentUser &&
    (currentUser._id === sellerId || currentUser.id === sellerId);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!sellerId) return;
      setLoading(true);
      try {
        let userData;
        try {
          userData = await userService.getUserById(sellerId);
        } catch (err) {
          const allItems = await itemService.getAllItems();
          const itemFromSeller = allItems.find(
            (i) => i.owner_id?._id === sellerId,
          );
          if (itemFromSeller) userData = itemFromSeller.owner_id;
        }

        setSeller(userData);

        const allItems = await itemService.getAllItems();
        const posts = allItems.filter(
          (item) => item.owner_id?._id === sellerId,
        );
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
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        User Not Found
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 flex flex-col items-center p-6 md:p-10">
        {/* Seller Profile Header */}
        <div className="bg-white rounded-3xl shadow-sm border p-8 w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600 shadow-inner overflow-hidden border-4 border-white">
            {seller.profile_image ? (
              <img
                src={seller.profile_image}
                className="w-full h-full object-cover"
                alt={seller.full_name}
              />
            ) : (
              seller.full_name?.charAt(0) || "U"
            )}
          </div>

          <div className="flex-1 flex flex-col text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              {seller.full_name}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-4">
              {seller.department || "AASTU Student"}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <Mail size={16} /> {seller.email}
              </div>
              <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <Calendar size={16} /> Joined{" "}
                {new Date(seller.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <ShoppingBag size={16} /> {sellerPosts.length} Items Posted
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-100"
                >
                  <Settings size={20} /> Edit Account
                </Link>
              ) : (
                <Link
                  to={`/contact-seller/${seller._id}`}
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-green-100"
                >
                  <MessageCircle size={20} /> Chat with Seller
                </Link>
              )}
              <button className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 px-8 py-3 rounded-xl font-bold transition">
                Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Seller Latest Posts */}
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-3xl font-bold text-gray-900">
              Latest Listings
            </h3>
            <span className="text-gray-500 font-medium">
              {sellerPosts.length} results
            </span>
          </div>

          {sellerPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sellerPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/item/${post._id}`}
                  className="group bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {post.images && post.images.length > 0 ? (
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <span className="text-gray-400 font-medium">
                        No Image Available
                      </span>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-blue-600 shadow-sm">
                      {post.category?.name || "Other"}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition truncate">
                      {post.title}
                    </h4>
                    <p className="text-2xl font-black text-blue-600 mb-3">
                      ${post.price}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2 flex-1">
                      {post.description}
                    </p>

                    <div className="mt-4 pt-4 border-t flex items-center text-xs text-gray-400 font-medium">
                      <Calendar size={12} className="mr-1" /> Posted on{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 border border-dashed flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <ShoppingBag size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">
                No postings yet
              </h4>
              <p className="text-gray-500">
                This user hasn't listed any items for sale yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ViewProfilePage;
