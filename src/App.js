import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Layout/Navbar';
import CustomCursor from './components/Layout/CustomCursor';
import ParticleBackground from './components/Layout/ParticleBackground';
import Home from './components/Portfolio/Home';
import About from './components/Portfolio/About';
import Projects from './components/Portfolio/Projects';
import Contact from './components/Portfolio/Contact';
import Dashboard from './components/Dashboard/Dashboard';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen relative overflow-hidden">
              <CustomCursor />
              <ParticleBackground />
              <Navbar />
              <main className="relative z-10">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;