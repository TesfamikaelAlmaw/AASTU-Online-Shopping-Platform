import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MessagePage from "./MessagePage";
import chatService from "../services/chat.service";
import authService from "../services/auth.service";

function ContactSeller() {
  const { sellerId } = useParams();
  const currentUser = authService.getCurrentUser();
  const [chatId, setChatId] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!sellerId || !currentUser || initializedRef.current) return;
    initializedRef.current = true;

    chatService.getChats().then((existingChats) => {
      const existing = existingChats.find((chat) =>
        chat.participants?.some((user) => user._id === sellerId),
      );

      if (existing) {
        setChatId(existing._id);
        return;
      }

      chatService.createChat(sellerId).then((chat) => {
        setChatId(chat._id);
      });
    });
  }, [sellerId, currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Login required</h2>
          <p className="text-gray-500 mb-4">
            Please sign in to chat with the seller.
          </p>
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Starting chat...</div>
      </div>
    );
  }

  return <MessagePage initialChatId={chatId} />;
}

export default ContactSeller;
