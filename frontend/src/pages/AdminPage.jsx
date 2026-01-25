import React, { useState } from "react";
import { Check, X, MoreHorizontal } from "lucide-react";
import ReportCard from "../components/ReportCard";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("User Management"); // Track active tab

  const users = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@aastu.edu.et",
      department: "Computer Science",
      status: "verified",
      joinDate: "2024-01-15",
      itemsPosted: 5,
    },
    {
      name: "Mike Chen",
      email: "mike.chen@aastu.edu.et",
      department: "Software Engineering",
      status: "pending",
      joinDate: "2024-01-14",
      itemsPosted: 2,
    },
    {
      name: "Alex Rivera",
      email: "alex.rivera@aastu.edu.et",
      department: "Information Systems",
      status: "verified",
      joinDate: "2024-01-13",
      itemsPosted: 8,
    },
    {
      name: "Emma Wilson",
      email: "emma.wilson@aastu.edu.et",
      department: "IT",
      status: "suspended",
      joinDate: "2024-01-12",
      itemsPosted: 3,
    },
  ];

  const stats = [
    { title: "Total Users", value: "1,234", change: "+12% from last month", icon: "👤" },
    { title: "Active Items", value: "2,547", change: "+8% from last month", icon: "📦" },
    { title: "Pending Reports", value: "23", change: "-15% from last month", icon: "🚩" },
    { title: "Daily Revenue", value: "$1,245", change: "+23% from last month", icon: "📈" },
  ];

  const statusColors = {
    verified: "bg-green-100 text-green-700",
    pending: "bg-gray-200 text-gray-700",
    suspended: "bg-red-100 text-red-700",
  };

  const Card = ({ children, className }) => (
    <div className={`bg-white shadow-md rounded-2xl ${className}`}>{children}</div>
  );

  const CardContent = ({ children, className }) => (
    <div className={`p-4 ${className}`}>{children}</div>
  );

  const MyButton = ({ children, variant, className, ...props }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring";
    const variantClasses =
      variant === "outline"
        ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
        : "bg-blue-500 text-white hover:bg-blue-600";

    return (
      <button className={`${baseClasses} ${variantClasses} ${className || ""}`} {...props}>
        {children}
      </button>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <MyButton>Export Data</MyButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {["User Management", "Item Management", "Reports", "Analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "User Management" && (
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent User Registrations</h2>
                <MyButton variant="outline">Verify All</MyButton>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">User</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Items Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>{user.joinDate}</td>
                      <td>{user.itemsPosted}</td>
                      <td className="flex space-x-2">
                        {user.status === "pending" && (
                          <>
                            <button className="text-green-500">
                              <Check size={16} />
                            </button>
                            <button className="text-red-500">
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button>
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {activeTab === "Reports" && <ReportCard />}

        {activeTab === "Item Management" && (
          <div>
            <p className="text-gray-500">Item Management content goes here...</p>
          </div>
        )}

        {activeTab === "Analytics" && (
          <div>
            <p className="text-gray-500">Analytics content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
