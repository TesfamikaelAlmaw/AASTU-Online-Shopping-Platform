import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import { 
  Loader2, User, Save, Lock, Palette, Camera, 
  ChevronRight, ArrowLeft 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form states
  const [profileData, setProfileData] = useState({ full_name: "", department: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }
      const data = await userService.getUserById(user._id || user.id);
      setCurrentUser(data);
      setProfileData({
        full_name: data.full_name || "",
        department: data.department || "",
      });
      setImagePreview(data.profile_image);
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      let latestUser = currentUser;
      
      if (imageFile) {
        console.log("Uploading profile image...");
        latestUser = await userService.uploadProfileImage(imageFile);
      }
      
      console.log("Updating profile data...", profileData);
      const updatedProfile = await userService.updateProfile(profileData);
      
      // Merge results
      const finalUser = { ...latestUser, ...updatedProfile };
      
      // Update local storage to reflect changes in Navbar
      const existingLocalUser = JSON.parse(localStorage.getItem('user')) || {};
      const updatedLocalUser = { ...existingLocalUser, ...finalUser };
      
      // Add a cache buster if it's the same URL (optional but helpful)
      if (updatedLocalUser.profile_image && !updatedLocalUser.profile_image.includes('?')) {
        // updatedLocalUser.profile_image += `?t=${Date.now()}`; 
      }

      localStorage.setItem('user', JSON.stringify(updatedLocalUser));
      
      console.log("Local storage updated with user:", updatedLocalUser);
      alert("Profile updated successfully!");
      
      // Navigate to profile to see changes
      const targetId = updatedLocalUser._id || updatedLocalUser.id;
      window.location.href = `/view-profile/${targetId}`;
    } catch (err) {
      console.error("Update failed", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("New passwords do not match");
    }
    setUpdating(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setUpdating(false);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full md:w-80 space-y-2">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900">Settings</h1>
              <p className="text-gray-500 font-medium">Manage your account and preferences</p>
            </div>

            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-black transition-all ${
                activeTab === "profile" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-600 hover:bg-white border border-transparent hover:border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <User size={20} /> Edit Profile
              </div>
              <ChevronRight size={18} opacity={activeTab === "profile" ? 1 : 0.3} />
            </button>

            <button 
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-black transition-all ${
                activeTab === "account" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-600 hover:bg-white border border-transparent hover:border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Lock size={20} /> Password & Security
              </div>
              <ChevronRight size={18} opacity={activeTab === "account" ? 1 : 0.3} />
            </button>

            <button 
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-black transition-all ${
                activeTab === "appearance" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-600 hover:bg-white border border-transparent hover:border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Palette size={20} /> Appearance
              </div>
              <ChevronRight size={18} opacity={activeTab === "appearance" ? 1 : 0.3} />
            </button>
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
            
            {activeTab === "profile" && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-gray-900 mb-8">Public Profile</h2>
                
                <form onSubmit={handleUpdateProfile} className="space-y-10">
                  {/* Photo Upload */}
                  <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-gray-50 pb-10">
                    <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                      <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                        {imagePreview ? (
                          <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          <User size={64} className="text-blue-200" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera className="text-white" size={24} />
                      </div>
                      <input id="profile-upload" type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Profile Picture</h3>
                      <p className="text-sm text-gray-400 mb-4 font-medium">JPG, GIF or PNG. Max size of 2MB.</p>
                      <button 
                        type="button"
                        onClick={() => document.getElementById('profile-upload').click()}
                        className="text-sm font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition"
                      >
                        Upload New
                      </button>
                    </div>
                  </div>

                  {/* Info Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Full Name</label>
                       <input 
                         type="text" 
                         value={profileData.full_name} 
                         onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                         className="w-full border-2 border-gray-50 rounded-2xl p-4 focus:border-blue-500 outline-none transition font-medium bg-gray-50/50 focus:bg-white"
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Department</label>
                       <input 
                         type="text" 
                         value={profileData.department} 
                         onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                         className="w-full border-2 border-gray-50 rounded-2xl p-4 focus:border-blue-500 outline-none transition font-medium bg-gray-50/50 focus:bg-white"
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-300 uppercase tracking-widest">Email Address (Locked)</label>
                       <input 
                         type="email" 
                         value={currentUser?.email} 
                         disabled
                         className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-100 text-gray-400 cursor-not-allowed outline-none font-medium"
                       />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50">
                    <button 
                      type="submit"
                      disabled={updating}
                      className="flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {updating ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> Save Profile</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "account" && (
               <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-black text-gray-900 mb-8">Security Settings</h2>
                  
                  <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Current Password</label>
                       <input 
                         type="password" 
                         value={passwordData.currentPassword}
                         onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                         className="w-full border-2 border-gray-50 rounded-2xl p-4 focus:border-blue-500 outline-none transition font-medium bg-gray-50/50 focus:bg-white"
                         required
                       />
                    </div>
                    
                    <div className="h-px bg-gray-50 my-6"></div>

                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-700 uppercase tracking-widest">New Password</label>
                       <input 
                         type="password" 
                         value={passwordData.newPassword}
                         onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                         className="w-full border-2 border-gray-50 rounded-2xl p-4 focus:border-blue-500 outline-none transition font-medium bg-gray-50/50 focus:bg-white"
                         required
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Confirm New Password</label>
                       <input 
                         type="password" 
                         value={passwordData.confirmPassword}
                         onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                         className="w-full border-2 border-gray-50 rounded-2xl p-4 focus:border-blue-500 outline-none transition font-medium bg-gray-50/50 focus:bg-white"
                         required
                       />
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={updating}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition disabled:opacity-50"
                      >
                        {updating ? <Loader2 className="animate-spin" size={24} /> : "Change Password"}
                      </button>
                    </div>
                  </form>
               </div>
            )}

            {activeTab === "appearance" && (
               <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-black text-gray-900 mb-8">Personalize Experience</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Interface Theme</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="border-2 border-blue-500 bg-white p-4 rounded-2xl cursor-pointer">
                           <div className="aspect-video bg-gray-50 rounded-lg mb-2"></div>
                           <p className="text-center font-black text-sm text-blue-600">Light Mode</p>
                        </div>
                        <div className="border-2 border-transparent bg-gray-100 p-4 rounded-2xl cursor-not-allowed opacity-50">
                           <div className="aspect-video bg-gray-800 rounded-lg mb-2"></div>
                           <p className="text-center font-black text-sm text-gray-400">Dark (Coming Soon)</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                       <div className="p-3 bg-blue-600 text-white rounded-xl">
                          <Palette size={24} />
                       </div>
                       <div>
                          <h4 className="font-black text-blue-900">Custom Colors</h4>
                          <p className="text-sm text-blue-700 font-medium">The ability to choose your own accent color is coming in the next update!</p>
                       </div>
                    </div>
                  </div>
               </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SettingsPage;
