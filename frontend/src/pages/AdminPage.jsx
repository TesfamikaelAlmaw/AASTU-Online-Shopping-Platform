import React, { useState, useEffect } from "react";
import { 
  Users, Package, Flag, BarChart3, ShieldAlert, Check, 
  X, Trash2, ShieldCheck, MoreVertical, Search, 
  TrendingUp, ArrowUpRight, Loader2, Layers, Plus, Edit
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import userService from "../services/user.service";
import reportService from "../services/report.service";
import itemService from "../services/item.service";
import authService from "../services/auth.service";
import categoryService from "../services/category.service";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Sorting & Pagination State
  const [userSort, setUserSort] = useState({ key: "full_name", direction: "asc" });
  const [itemSort, setItemSort] = useState({ key: "createdAt", direction: "desc" });
  const [reportSort, setReportSort] = useState({ key: "createdAt", direction: "desc" });
  const [categorySort, setCategorySort] = useState({ key: "name", direction: "asc" });
  
  const [userPage, setUserPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
       alert("Access Denied: You must be an administrator to view this page.");
       window.location.href = "/student";
       return;
    }

    setLoading(true);
    try {
      const [u, r, i, c] = await Promise.all([
        userService.getAllUsers(),
        reportService.getAllReports(),
        itemService.getAllItems(),
        categoryService.getAllCategories()
      ]);
      setUsers(u || []);
      setReports(r || []);
      setItems(i || []);
      setCategories(c || []);
    } catch (error) {
      console.error("Dashboard error", error);
      if (error.response?.status === 403) {
        alert("Session expired or insufficient permissions. Please log in again as Admin.");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper: Sort and Filter Logic
  const getProcessedData = (data, sortConfig, page, query, searchFields) => {
    // 1. Filter
    let filtered = data.filter(item => 
      searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return String(value || "").toLowerCase().includes(query.toLowerCase());
      })
    );

    // 2. Sort
    filtered.sort((a, b) => {
      const valA = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
      const valB = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);
      
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    // 3. Paginate
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return { data: paginated, totalPages, totalCount: filtered.length };
  };

  const handleSort = (type, key) => {
    if (type === "user") {
      setUserSort(prev => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
      }));
      setUserPage(1);
    } else if (type === "item") {
      setItemSort(prev => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
      }));
      setItemPage(1);
    } else if (type === "report") {
      setReportSort(prev => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
      }));
      setReportPage(1);
    } else if (type === "category") {
      setCategorySort(prev => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
      }));
      setCategoryPage(1);
    }
  };

  const Pagination = ({ current, total, onChange }) => {
    if (total <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button 
          disabled={current === 1}
          onClick={() => onChange(current - 1)}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
        >
          <ArrowUpRight className="rotate-[225deg]" size={20} />
        </button>
        {[...Array(total)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
              current === i + 1 ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button 
          disabled={current === total}
          onClick={() => onChange(current + 1)}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
        >
          <ArrowUpRight className="rotate-45" size={20} />
        </button>
      </div>
    );
  };

  const handleUpdateUserStatus = async (id, status) => {
    try {
      await userService.updateUserStatus(id, { status });
      fetchData();
    } catch (error) {
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is irreversible.")) return;
    try {
      await userService.deleteUser(id);
      fetchData();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Remove this item from the platform?")) return;
    try {
      await itemService.deleteItem(id);
      fetchData();
    } catch (error) {
      alert("Failed to remove item");
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, { name: categoryName });
      } else {
        await categoryService.createCategory({ name: categoryName });
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryName("");
      fetchData();
    } catch (error) {
      alert("Failed to save category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure? This may affect items in this category.")) return;
    try {
      await categoryService.deleteCategory(id);
      fetchData();
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      if (action === "resolve") {
        await reportService.updateReport(reportId, { status: "resolved" });
      } else if (action === "delete") {
        await reportService.deleteReport(reportId);
      }
      fetchData();
    } catch (error) {
      alert("Action failed");
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
        activeTab === id 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className={`p-4 rounded-2xl ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );

  if (loading && activeTab === "overview") {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex max-w-[1600px] mx-auto w-full p-6 gap-8">
        
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 gap-2">
          <div className="mb-6 px-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Admin Console</h2>
          </div>
          <SidebarItem id="overview" icon={BarChart3} label="Overview" />
          <SidebarItem id="users" icon={Users} label="Users" />
          <SidebarItem id="items" icon={Package} label="Listings" />
          <SidebarItem id="reports" icon={Flag} label="Reports" />
          <SidebarItem id="categories" icon={Layers} label="Categories" />
          
          <div className="mt-auto p-4 bg-red-50 rounded-2xl border border-red-100">
             <div className="flex items-center gap-2 text-red-600 mb-2">
                <ShieldAlert size={18} />
                <span className="font-bold text-sm">Security Alert</span>
             </div>
             <p className="text-xs text-red-500 leading-tight">You are currently in SuperAdmin mode. All actions are logged.</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <h1 className="text-3xl font-black text-gray-900 capitalize">{activeTab}</h1>
               <p className="text-gray-500 font-medium">Real-time platform monitoring</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <button className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-black transition">Export</button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  <StatCard title="Total Users" value={users.length} icon={Users} color="bg-blue-600" />
                  <StatCard title="Active Listings" value={items.length} icon={Package} color="bg-green-600" />
                  <StatCard title="Total Reports" value={reports.length} icon={Flag} color="bg-red-500" />
                  <StatCard title="Growth Rate" value="+12%" icon={TrendingUp} color="bg-orange-500" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                     <h3 className="font-black text-gray-900 mb-6">User Activity</h3>
                     <div className="h-64 flex items-end gap-3 px-4">
                        {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40, 75, 95].map((h, i) => (
                           <div key={i} className="flex-1 bg-blue-50 rounded-t-lg relative group transition-all hover:bg-blue-600">
                              <div style={{ height: `${h}%` }} className="w-full bg-blue-600 rounded-t-lg absolute bottom-0 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                           </div>
                        ))}
                     </div>
                     <div className="flex justify-between mt-4 text-xs font-bold text-gray-400">
                        <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
                     </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                     <h3 className="font-black text-gray-900 mb-6">Quick Overview</h3>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm font-bold text-gray-600">Verified Users</span>
                           </div>
                           <span className="text-sm font-black">{users.filter(u => u.status === 'active').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="text-sm font-bold text-gray-600">Suspended</span>
                           </div>
                           <span className="text-sm font-black">{users.filter(u => u.status === 'suspended').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-bold text-gray-600">Total Items</span>
                           </div>
                           <span className="text-sm font-black">{items.length}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "users" && (() => {
            const { data: processedUsers, totalPages, totalCount } = getProcessedData(
              users, userSort, userPage, searchQuery, ["full_name", "email", "department"]
            );
            return (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4 px-2">
                   <p className="text-sm font-bold text-gray-500 tracking-wide">
                     Showing <span className="text-blue-600">{processedUsers.length}</span> of <span className="text-gray-900">{totalCount}</span> total users
                   </p>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                         <tr>
                            <th 
                              className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition"
                              onClick={() => handleSort("user", "full_name")}
                            >
                              User Details {userSort.key === "full_name" && (userSort.direction === "asc" ? "↑" : "↓")}
                            </th>
                            <th 
                              className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition"
                              onClick={() => handleSort("user", "department")}
                            >
                              Department {userSort.key === "department" && (userSort.direction === "asc" ? "↑" : "↓")}
                            </th>
                            <th 
                              className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition"
                              onClick={() => handleSort("user", "status")}
                            >
                              Status {userSort.key === "status" && (userSort.direction === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {processedUsers.map((u) => (
                            <tr key={u._id} className="hover:bg-blue-50/30 transition">
                           <td className="px-6 py-4">
                              <Link to={`/view-profile/${u._id}`} className="flex items-center gap-3 group">
                                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                                    {u.profile_image ? <img src={u.profile_image} className="w-full h-full object-cover" /> : u.full_name?.charAt(0)}
                                 </div>
                                 <div className="group-hover:translate-x-1 transition-transform">
                                    <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{u.full_name}</p>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                 </div>
                              </Link>
                           </td>
                               <td className="px-6 py-4 text-sm font-bold text-gray-600">{u.department}</td>
                               <td className="px-6 py-4 text-sm font-bold">
                                  <span className={`px-3 py-1 rounded-full text-xs ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                     {u.status}
                                  </span>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     {u.status === 'active' ? (
                                        <button onClick={() => handleUpdateUserStatus(u._id, 'suspended')} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition" title="Suspend"><ShieldAlert size={18} /></button>
                                     ) : (
                                        <button onClick={() => handleUpdateUserStatus(u._id, 'active')} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition" title="Activate"><ShieldCheck size={18} /></button>
                                     )}
                                     <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <Pagination current={userPage} total={totalPages} onChange={setUserPage} />
              </div>
            );
          })()}

          {activeTab === "items" && (() => {
            const { data: processedItems, totalPages, totalCount } = getProcessedData(
              items, itemSort, itemPage, searchQuery, ["title", "description", "category.name"]
            );
            return (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 px-2">
                   <p className="text-sm font-bold text-gray-500 tracking-wide">
                     Showing <span className="text-blue-600">{processedItems.length}</span> of <span className="text-gray-900">{totalCount}</span> active items
                   </p>
                   <select 
                     className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition"
                     value={`${itemSort.key}-${itemSort.direction}`}
                     onChange={(e) => {
                       const [key, dir] = e.target.value.split('-');
                       setItemSort({ key, direction: dir });
                     }}
                   >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="title-asc">Name: A-Z</option>
                   </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {processedItems.map((item) => (
                      <div key={item._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
                         <div className="h-40 bg-gray-100 relative">
                            {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover" />}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => handleDeleteItem(item._id)} className="p-2 bg-red-600 text-white rounded-xl shadow-lg"><Trash2 size={16} /></button>
                            </div>
                         </div>
                         <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                               <h3 className="font-black text-gray-900 truncate flex-1 mr-2">{item.title}</h3>
                               <span className="text-blue-600 font-black">${item.price}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-4">{item.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                           <Link to={`/view-profile/${item.owner_id?._id || item.owner_id?.id}`} className="flex items-center gap-2 hover:opacity-75 transition">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                 {item.owner_id?.full_name?.charAt(0)}
                              </div>
                              <span className="text-[10px] font-bold text-gray-700 truncate w-24">{item.owner_id?.full_name}</span>
                           </Link>
                           <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.category?.name || 'Other'}</span>
                        </div>
                         </div>
                      </div>
                   ))}
                </div>
                <Pagination current={itemPage} total={totalPages} onChange={setItemPage} />
              </div>
            );
          })()}

          {activeTab === "reports" && (() => {
            const { data: processedReports, totalPages, totalCount } = getProcessedData(
              reports, reportSort, reportPage, searchQuery, 
              ["reason", "reporter.full_name", "reported_item.title"]
            );
            return (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-4 gap-4 px-2">
                   <p className="text-sm font-bold text-gray-500 tracking-wide">
                     Showing <span className="text-red-500">{processedReports.length}</span> of <span className="text-gray-900">{totalCount}</span> filed reports
                   </p>
                   <select 
                     className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                     value={`${reportSort.key}-${reportSort.direction}`}
                     onChange={(e) => {
                       const [key, dir] = e.target.value.split('-');
                       handleSort("report", key); // Use handleSort to update state correctly
                       // setReportSort({ key, direction: dir }); // Manual set is also fine but handleSort resets page
                     }}
                   >
                      <option value="createdAt-desc">Recent Reports</option>
                      <option value="createdAt-asc">Oldest Reports</option>
                      <option value="reason-asc">Sort by Reason (A-Z)</option>
                   </select>
                </div>

                <div className="space-y-4">
                   {processedReports.map((report) => (
                      <div key={report._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                               {/* Reporter Info */}
                               <div>
                                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Reporter</span>
                                  <Link to={`/view-profile/${report.reporter?._id}`} className="flex items-center gap-2 group">
                                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                        {report.reporter?.full_name?.charAt(0)}
                                     </div>
                                     <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition">{report.reporter?.full_name}</span>
                                  </Link>
                               </div>

                               {/* Reported Item Info */}
                               <div>
                                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Reported Item</span>
                                  <Link to={`/item/${report.reported_item?._id}`} className="group block">
                                     <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition truncate">{report.reported_item?.title || 'Unknown Item'}</p>
                                     <p className="text-xs text-blue-500 font-bold">Price: ${report.reported_item?.price}</p>
                                  </Link>
                               </div>

                               {/* Item Owner Info */}
                               <div>
                                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Item Owner</span>
                                  <Link to={`/view-profile/${report.reported_item?.owner_id?._id}`} className="flex items-center gap-2 group">
                                     <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xs uppercase">
                                        {report.reported_item?.owner_id?.full_name?.charAt(0)}
                                     </div>
                                     <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition">{report.reported_item?.owner_id?.full_name || 'System User'}</span>
                                  </Link>
                               </div>

                               {/* Reason & Date */}
                               <div className="md:col-span-2 xl:col-span-3">
                                  <div className="flex items-center gap-4 py-3 border-t border-gray-50">
                                     <div className="flex-1">
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-0.5 block">Reason for Report</span>
                                        <p className="text-sm font-bold text-gray-600 leading-relaxed italic">"{report.reason}"</p>
                                     </div>
                                     <div className="text-right">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 block">Report Date</span>
                                        <span className="text-xs font-bold text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                               <button 
                                 onClick={() => handleResolveReport(report._id, "resolve")}
                                 className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-50 text-green-600 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-green-100 transition"
                               >
                                  <Check size={18} /> Resolve
                               </button>
                               <button 
                                 onClick={() => handleResolveReport(report._id, "delete")}
                                 className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-500 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-red-100 transition"
                               >
                                  <Trash2 size={18} /> Delete
                               </button>
                            </div>
                         </div>
                      </div>
                   ))}
                   {processedReports.length === 0 && (
                      <div className="bg-white p-20 rounded-3xl border border-dashed text-center">
                         <BarChart3 className="mx-auto text-gray-200 mb-4" size={64} />
                         <h3 className="text-xl font-black text-gray-900">All Clear!</h3>
                         <p className="text-gray-500">No reports found matching your criteria.</p>
                      </div>
                   )}
                </div>
                <Pagination current={reportPage} total={totalPages} onChange={setReportPage} />
              </div>
            );
          })()}

          {activeTab === "categories" && (() => {
            const { data: processedCategories, totalPages, totalCount } = getProcessedData(
              categories, categorySort, categoryPage, searchQuery, ["name"]
            );
            return (
              <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 px-2">
                   <p className="text-sm font-bold text-gray-500 tracking-wide">
                     Showing <span className="text-blue-600">{processedCategories.length}</span> of <span className="text-gray-900">{totalCount}</span> marketplace categories
                   </p>
                   <button 
                     onClick={() => {
                        setEditingCategory(null);
                        setCategoryName("");
                        setIsCategoryModalOpen(true);
                     }}
                     className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                   >
                      <Plus size={18} /> New Category
                   </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                         <tr>
                            <th 
                              className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition"
                              onClick={() => handleSort("category", "name")}
                            >
                              Category Name {categorySort.key === "name" && (categorySort.direction === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Active Items</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {processedCategories.map((c) => {
                            const itemCount = items.filter(item => (item.category?._id || item.category) === c._id).length;
                            return (
                              <tr key={c._id} className="hover:bg-blue-50/30 transition">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                          <Layers size={20} />
                                       </div>
                                       <p className="text-sm font-black text-gray-900">{c.name}</p>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                                       {itemCount} items
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                     <button 
                                       onClick={() => {
                                          setEditingCategory(c);
                                          setCategoryName(c.name);
                                          setIsCategoryModalOpen(true);
                                       }}
                                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                                       title="Edit"
                                     >
                                        <Edit size={18} />
                                     </button>
                                     <button 
                                       onClick={() => handleDeleteCategory(c._id)} 
                                       className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" 
                                       title="Delete"
                                     >
                                        <Trash2 size={18} />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                            );
                         })}
                         {processedCategories.length === 0 && (
                            <tr>
                               <td colSpan="3" className="p-20 text-center">
                                  <Layers className="mx-auto text-gray-200 mb-4" size={64} />
                                  <h3 className="text-xl font-black text-gray-900">No Categories Found</h3>
                                  <p className="text-gray-500">Try refining your search or add a new category.</p>
                               </td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
                <Pagination current={categoryPage} total={totalPages} onChange={setCategoryPage} />
              </div>
            );
          })()}

        </main>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-3xl font-black text-gray-900">{editingCategory ? "Edit Category" : "New Category"}</h2>
                 <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <X size={24} />
                 </button>
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-6">
                 <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Category Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-6 py-4 text-lg font-bold outline-none transition-all"
                      placeholder="e.g. Electronics, Books..."
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      autoFocus
                      required
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="flex-1 bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-lg hover:bg-gray-200 hover:text-gray-600 transition"
                    >
                       Cancel
                    </button>
                    <button 
                       type="submit"
                       className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0"
                    >
                       {editingCategory ? "Update Changes" : "Create Category"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
