// src/pages/NotificationPage.jsx
import React from "react";

function NotificationPage() {
  // Fake notifications
  const notifications = [
    { id: "1", text: "Your item 'Data Structures Book' got a new offer." },
    { id: "2", text: "John Doe sent you a message." },
    { id: "3", text: "Your item 'Laptop' has been sold!" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="p-4 hover:bg-gray-100 transition text-gray-700"
          >
            {notif.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPage;
