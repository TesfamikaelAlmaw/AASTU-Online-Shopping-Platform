import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentPage from './pages/StudentPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

 