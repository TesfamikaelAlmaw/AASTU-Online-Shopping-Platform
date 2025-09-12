import React, { useState } from "react";

function ContactSeller() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { from: "seller", text: "Hello! This book is still available." },
    { from: "buyer", text: "Great! Can you tell me the condition?" },
    { from: "seller", text: "It’s in excellent condition, almost new." },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    setChat([...chat, { from: "buyer", text: message }]);
    setMessage("");
  };

  // Fake seller profile
  const seller = {
    name: "John Doe",
    email: "johndoe@university.edu",
    department: "Computer Science",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  return (
    <div className="flex w-full h-screen p-6 bg-gray-50 gap-6">
      {/* Left: Seller Profile */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow flex flex-col items-center">
        <img
          src={seller.avatar}
          alt="Seller Avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-lg font-bold">{seller.name}</h2>
        <p className="text-gray-600">{seller.department}</p>
        <p className="text-gray-500 text-sm">{seller.email}</p>
        <span className="mt-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          Online
        </span>
      </div>

      {/* Right: Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="text-xl font-bold mb-4">Chat with Seller</div>

        {/* Chat box */}
        <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-white shadow-sm">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                msg.from === "buyer" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`px-3 py-2 rounded-2xl text-sm ${
                  msg.from === "buyer"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactSeller;
