import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/CategoryPage";
import ContactSeller from "./pages/ContactSeller";
import ViewProfilePage from "./pages/ViewProfilePage";
import SellItemPage from "./pages/SellItemPage";
import MessagePage from "./pages/MessagePage";
import NotificationPage from "./pages/NotificationPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          {/* student page  */}
          <Route path="/student" element={<StudentPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/contact-seller/:sellerId" element={<ContactSeller />} />
          <Route path="/view-profile/:sellerId" element={<ViewProfilePage />} />
          <Route path="/sell_item" element={<SellItemPage />} />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
