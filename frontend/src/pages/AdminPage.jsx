import React, { useState, useEffect } from "react";
import { Check, X, MoreHorizontal, Loader2 } from "lucide-react";
import ReportCard from "../components/ReportCard";
import userService from "../services/user.service";
import reportService from "../services/report.service";
import itemService from "../services/item.service";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("User Management");
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, r, i] = await Promise.all([
        userService.getAllUsers(),
        reportService.getAllReports(),
        itemService.getAllItems()
      ]);
      setUsers(u);
      setReports(r);
      setItems(i);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (id, status) => {
    try {
      await userService.updateUserStatus(id, { status });
      fetchData(); // Refresh
    } catch (error) {
      alert("Failed to update user status");
    }
  };

  const stats = [
    { title: "Total Users", value: users.length, change: "", icon: "👤" },
    { title: "Active Items", value: items.length, change: "", icon: "📦" },
    { title: "Pending Reports", value: reports.length, change: "", icon: "🚩" },
    { title: "Daily Revenue", value: "N/A", change: "", icon: "📈" },
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <>
            {activeTab === "User Management" && (
              <Card>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">User Management</h2>
                  </div>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">User</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Join Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2">
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </td>
                          <td>{user.department}</td>
                          <td>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status] || 'bg-gray-100 text-gray-600'}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="flex space-x-2">
                            {user.status === "pending" && (
                              <>
                                <button className="text-green-500" onClick={() => handleUpdateUserStatus(user._id, 'verified')}>
                                  <Check size={16} />
                                </button>
                                <button className="text-red-500" onClick={() => handleUpdateUserStatus(user._id, 'suspended')}>
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

            {activeTab === "Reports" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.length > 0 ? reports.map((report, idx) => (
                  <ReportCard 
                    key={idx}
                    item={report.item_id} 
                    reporter={report.reporter_id}
                    reason={report.reason}
                    status={report.status}
                    date={new Date(report.createdAt).toLocaleDateString()}
                  />
                )) : (
                  <p className="text-gray-500">No reports found.</p>
                )}
              </div>
            )}

            {activeTab === "Item Management" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((item, idx) => (
                   <Card key={idx}>
                      <CardContent>
                         <h3 className="font-bold">{item.title}</h3>
                         <p className="text-sm text-gray-600">{item.description}</p>
                         <p className="text-blue-600 font-bold">${item.price}</p>
                         <p className="text-xs text-gray-400">Seller: {item.owner_id?.full_name}</p>
                      </CardContent>
                   </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
