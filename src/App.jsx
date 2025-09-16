import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import LandingPage from './pages/LandingPage';

// Import components directly to avoid lazy loading issues
import Dashboard from './pages/Dashboard';
import ServiceStations from './pages/ServiceStations';
import Appointments from './pages/Appointments';

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('Error caught by boundary:', error, errorInfo);
      setHasError(true);
      setError(error);
    };

    // Add error event listener
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-12 text-center">
        <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Something went wrong. Please refresh the page.
        </div>
        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return children;
};

const App = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const handleChatbotToggle = () => {
    setChatbotOpen(!chatbotOpen);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header onChatbotToggle={handleChatbotToggle} />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/service-stations" element={<ServiceStations />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot open={chatbotOpen} onClose={handleChatbotToggle} />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
