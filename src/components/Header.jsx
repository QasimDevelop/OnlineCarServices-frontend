import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ onChatbotToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleChatbotToggle = () => {
    if (onChatbotToggle) {
      onChatbotToggle();
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-blue-600 shadow-md">
      <div className="px-4 md:px-12">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🚗 Car Services
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 ml-8">
            <button
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isActiveRoute("/")
                  ? "bg-white bg-opacity-20"
                  : "hover:bg-white hover:bg-opacity-15"
              }`}
              onClick={() => navigate("/")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </button>

            <button
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isActiveRoute("/dashboard")
                  ? "bg-white bg-opacity-20"
                  : "hover:bg-white hover:bg-opacity-15"
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Dashboard
            </button>
            <button
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isActiveRoute("/service-stations")
                  ? "bg-white bg-opacity-20"
                  : "hover:bg-white hover:bg-opacity-15"
              }`}
              onClick={() => navigate("/service-stations")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                  clipRule="evenodd"
                />
              </svg>
              Service Stations
            </button>
            <button
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isActiveRoute("/appointments")
                  ? "bg-white bg-opacity-20"
                  : "hover:bg-white hover:bg-opacity-15"
              }`}
              onClick={() => navigate("/appointments")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Appointments
            </button>
            <button
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isActiveRoute("/job-cards")
                  ? "bg-white bg-opacity-20"
                  : "hover:bg-white hover:bg-opacity-15"
              }`}
              onClick={() => navigate("/all-job-cards")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H4zm1 2h10v10H5V5z"
                  clipRule="evenodd"
                />
              </svg>
              Job Cards
            </button>

            <button
              className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 hover:bg-white hover:bg-opacity-15"
              onClick={handleChatbotToggle}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              Chat Support
            </button>
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              className="ml-2 p-1 text-white rounded-full hover:bg-white hover:bg-opacity-20 transition-colors relative"
              onClick={handleMenuOpen}
            >
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </button>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-white border border-white border-opacity-30 rounded-lg hover:border-white hover:bg-white hover:bg-opacity-20 transition-colors"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
              <button
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            onClick={handleMenuOpen}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {anchorEl && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4 min-w-[200px]">
            <button
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              onClick={() => handleNavigation("/")}
            >
              <svg
                className={`w-5 h-5 ${isActiveRoute("/") ? "text-blue-600" : "text-gray-600"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              onClick={() => handleNavigation("/dashboard")}
            >
              <svg
                className={`w-5 h-5 ${isActiveRoute("/dashboard") ? "text-blue-600" : "text-gray-600"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Dashboard
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              onClick={() => handleNavigation("/service-stations")}
            >
              <svg
                className={`w-5 h-5 ${isActiveRoute("/service-stations") ? "text-blue-600" : "text-gray-600"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                  clipRule="evenodd"
                />
              </svg>
              Service Stations
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              onClick={() => handleNavigation("/appointments")}
            >
              <svg
                className={`w-5 h-5 ${isActiveRoute("/appointments") ? "text-blue-600" : "text-gray-600"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Appointments
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              onClick={handleChatbotToggle}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              Chat Support
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              onClick={() => handleNavigation("/job-cards")}
            >
              <svg
                className={`w-5 h-5 ${isActiveRoute("/all-job-cards") ? "text-blue-600" : "text-gray-600"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H4zm1 2h10v10H5V5z"
                  clipRule="evenodd"
                />
              </svg>
              Job Cards
            </button>
            <hr className="my-2" />
            <button
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              onClick={handleLogout}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-2.293 2.293z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
