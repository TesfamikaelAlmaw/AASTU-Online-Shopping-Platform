import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import itemService from "../services/item.service";
import authService from "../services/auth.service";
import reportService from "../services/report.service";
import reactionService from "../services/reaction.service";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  Loader2,
  ChevronLeft,
  Share2,
  Info,
  Edit,
  Trash2,
  Save,
  X,
  Send,
  ThumbsUp,
  AlertTriangle,
  User as UserIcon,
} from "lucide-react";

function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    price: "",
    description: "",
  });
  const [updating, setUpdating] = useState(false);

  // Social state
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const currentUser = authService.getCurrentUser();

  // Robust check for ownership
  const getID = (obj) => {
    if (!obj) return null;
    return typeof obj === "string" ? obj : obj._id || obj.id;
  };

  const currentUserId = getID(currentUser);
  const ownerId = getID(item?.owner_id);

  const isOwner =
    currentUserId && ownerId && currentUserId.toString() === ownerId.toString();
  const isAdmin = currentUser?.role === "admin";
  const isAuthorized = isOwner || isAdmin;
  const isLiked = item?.likes?.includes(currentUserId);

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const data = await itemService.getItemById(itemId);
      setItem(data);
      setEditData({
        title: data.title,
        price: data.price,
        description: data.description,
      });
    } catch (err) {
      console.error("Failed to fetch item details", err);
      setError("Item not found or an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return alert("Please login to like items");
    try {
      const updatedItem = await reactionService.likeItem(itemId);
      setItem(updatedItem);
    } catch (err) {
      console.error("Failed to like item", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please login to comment");
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const updatedItem = await reactionService.addComment(itemId, commentText);
      setItem(updatedItem);
      setCommentText("");
    } catch (err) {
      alert("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const updatedItem = await reactionService.deleteComment(
        itemId,
        commentId,
      );
      setItem(updatedItem);
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  const handleReport = async () => {
    if (!currentUser) return alert("Please login to report");
    if (!reportReason.trim()) return;

    setSubmittingReport(true);
    try {
      await reportService.createReport({
        reported_item: itemId,
        reason: reportReason,
      });
      alert("Item reported successfully. Our team will review it.");
      setShowReportModal(false);
      setReportReason("");
    } catch (err) {
      alert("Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await itemService.updateItem(itemId, {
        ...editData,
        price: Number(editData.price),
      });
      setIsEditing(false);
      fetchItem();
      alert("Item updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update item");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this item? This action cannot be undone.",
      )
    ) {
      try {
        await itemService.deleteItem(itemId);
        alert("Item deleted successfully");
        navigate("/student");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete item");
      }
    }
  };

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

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="text-xl text-gray-600 mb-4">
            {error || "Item not found"}
          </p>
          <Link
            to="/student"
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            <ChevronLeft size={20} /> Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/student"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <ChevronLeft size={20} /> Back to Marketplace
          </Link>
          {!isOwner && (
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500 transition uppercase tracking-widest"
            >
              <AlertTriangle size={14} /> Report Item
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-sm overflow-hidden p-6 md:p-12 mb-10 border border-gray-100">
          {/* Image Section */}
          <div className="relative group">
            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-300">
                  <Info size={64} className="mb-2" />
                  <span className="font-bold">No images available</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLike}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all scale-100 active:scale-90 ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Item Title
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="w-full border-2 rounded-xl p-3 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Price (ETB)
                  </label>
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                    className="w-full border-2 rounded-xl p-3 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="5"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="w-full border-2 rounded-xl p-3 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    disabled={updating}
                    onClick={handleUpdate}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    {updating ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={20} /> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    <X size={20} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-3 mb-4">
                  <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
                    {item.category?.name || item.category || "Other"}
                  </span>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                      item.condition === "new"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {item.condition || "Used"}
                  </span>
                </div>

                <h1 className="text-4xl font-black text-gray-900 mb-3">
                  {item.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-gray-400 font-bold mb-8">
                  <div className="flex items-center gap-1.5">
                    <Clock size={18} />{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={18} /> {item.owner_id?.department || "AASTU"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp size={18} /> {item.likes?.length || 0} Likes
                  </div>
                </div>

                <div className="text-5xl font-black text-blue-600 mb-10">
                  {item.price.toLocaleString()}{" "}
                  <span className="text-xl font-bold opacity-70">ETB</span>
                </div>

                <div className="border-t border-gray-100 py-8 mb-4">
                  <h3 className="font-black text-gray-900 mb-4 text-lg">
                    About this item
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                    {item.description}
                  </p>
                </div>

                {!isAuthorized ? (
                  <div className="mt-auto">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6 group hover:border-blue-200 transition">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-100">
                            {item.owner_id?.full_name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900">
                              {item.owner_id?.full_name}
                            </h4>
                            <p className="text-xs text-gray-500 font-bold uppercase">
                              {item.owner_id?.department || "Student"}
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/view-profile/${getID(item.owner_id)}`}
                          className="text-blue-600 text-sm font-black hover:underline"
                        >
                          View Profile
                        </Link>
                      </div>
                      <p className="text-xs text-gray-500 font-bold">
                        Trustworthy seller. Verified AASTU student.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Link
                        to={`/contact-seller/${getID(item.owner_id)}`}
                        className="flex-1 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black transition shadow-lg shadow-green-100"
                      >
                        <MessageCircle size={22} /> Contact Seller
                      </Link>
                      <button
                        onClick={handleLike}
                        className={`flex items-center justify-center gap-2 px-8 rounded-2xl font-black transition shadow-lg ${
                          isLiked
                            ? "bg-red-50 text-red-600 border border-red-100 shadow-red-50"
                            : "bg-white text-gray-600 border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                        }`}
                      >
                        <Heart
                          size={22}
                          fill={isLiked ? "currentColor" : "none"}
                        />
                        {item.likes?.length || 0}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 mt-auto">
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-4">
                      <h4 className="font-black text-blue-900 mb-1 flex items-center gap-2">
                        <Info size={20} />{" "}
                        {isAdmin ? "Admin Controls" : "Owner Dashboard"}
                      </h4>
                      <p className="text-sm text-blue-700 font-medium">
                        {isAdmin
                          ? "Review management options for this public listing."
                          : "You can manage your listing details or remove it from the market."}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black transition shadow-lg shadow-blue-100"
                      >
                        <Edit size={20} /> Edit Listing
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 py-4 rounded-2xl font-black hover:bg-red-100 transition"
                      >
                        <Trash2 size={20} /> Remove Item
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-12">
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <MessageCircle size={28} className="text-blue-500" />
            Comments ({item.comments?.length || 0})
          </h2>

          <div className="space-y-8 mb-10">
            {item.comments && item.comments.length > 0 ? (
              item.comments.map((comment) => (
                <div key={comment._id} className="flex gap-5 group">
                  <Link
                    to={`/view-profile/${getID(comment.user)}`}
                    className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 hover:bg-blue-100 hover:text-blue-500 transition-colors"
                  >
                    <UserIcon size={24} />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <Link
                        to={`/view-profile/${getID(comment.user)}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <h4 className="font-black text-gray-900">
                          {comment.user?.full_name || "Deleted User"}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-black text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {(getID(comment.user) === currentUserId || isAdmin) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-gray-300 hover:text-red-500 transition p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center flex flex-col items-center gap-3 text-gray-400">
                <MessageCircle size={48} className="opacity-20" />
                <p className="font-black italic">
                  No questions yet. Be the first to ask!
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleAddComment} className="relative">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                currentUser
                  ? "Ask the seller a question..."
                  : "Login to post a comment"
              }
              disabled={!currentUser || submittingComment}
              className="w-full border-2 border-gray-100 rounded-2xl p-6 pr-16 focus:border-blue-500 outline-none transition font-medium min-h-[120px] bg-gray-50 focus:bg-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={
                !currentUser || submittingComment || !commentText.trim()
              }
              className="absolute bottom-6 right-6 p-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition disabled:bg-gray-300 disabled:shadow-none"
            >
              {submittingComment ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <Send size={24} />
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <AlertTriangle className="text-red-500" /> Report Listing
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-sm text-gray-500 font-bold mb-6 italic">
              Please let us know why you are reporting this listing. We take
              student safety seriously.
            </p>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Reason for report (e.g. Scammer, Inappropriate content, Sold)..."
              className="w-full border-2 border-gray-100 rounded-2xl p-5 mb-6 focus:border-red-500 outline-none transition min-h-[150px] font-medium"
            />

            <div className="flex gap-4">
              <button
                disabled={submittingReport || !reportReason.trim()}
                onClick={handleReport}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-black transition shadow-lg shadow-red-100 disabled:bg-gray-200 disabled:shadow-none"
              >
                {submittingReport ? (
                  <Loader2 className="animate-spin mx-auto" size={24} />
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ItemDetailPage;
