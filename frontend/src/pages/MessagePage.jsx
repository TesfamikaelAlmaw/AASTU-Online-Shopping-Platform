// src/pages/MessagePage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function MessagePage() {
  // Fake chat list
  const chats = [
    {
      id: "1",
      sellerName: "John Doe",
      lastMessage: "Hello! Is this still available?",
      avatar: "https://i.pravatar.cc/50?img=3",
    },
    {
      id: "2",
      sellerName: "Jane Smith",
      lastMessage: "I can sell it for 200 ETB",
      avatar: "https://i.pravatar.cc/50?img=5",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            to={`/contact-seller/${chat.id}`}
            className="flex items-center p-4 hover:bg-gray-100 transition"
          >
            <img
              src={chat.avatar}
              alt={chat.sellerName}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-1">
              <p className="font-semibold">{chat.sellerName}</p>
              <p className="text-gray-500 text-sm">{chat.lastMessage}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MessagePage;
