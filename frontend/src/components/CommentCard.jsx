// src/components/CommentCard.jsx
import React, { useState } from "react";

function CommentCard({ comments = [] }) {
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(comments);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Add new comment (fake user)
    const commentToAdd = {
      id: Date.now(),
      user: "Current User",
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };

    setAllComments([commentToAdd, ...allComments]);
    setNewComment("");
  };

  return (
    <div className="mt-6 w-full max-w-3xl">
      <h3 className="text-xl font-bold mb-4">Comments</h3>

      {/* Add Comment */}
      <form onSubmit={handleAddComment} className="flex flex-col gap-2 mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="border rounded p-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition self-end"
        >
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="flex flex-col gap-4">
        {allComments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          allComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-100 p-4 rounded shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{comment.user}</p>
                <span className="text-gray-500 text-sm">{comment.timestamp}</span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentCard;
