import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { ControlsProvider } from './contexts/ControlsContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ControlsProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </motion.main>
          </div>
        </Router>
      </ControlsProvider>
    </AuthProvider>
  );
}

export default App;