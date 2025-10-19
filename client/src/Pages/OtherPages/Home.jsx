import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiRefreshCw, FiLoader, FiX } from 'react-icons/fi';
import backImage from '../../assets/GEHU-Dehradun-1abd6f9c.jpg';
// Import your logo directly
import logo from '../../assets/Logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState('student'); // 'student' or 'teacher'
  const navigate=useNavigate();
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captchaText = '';
    for (let i = 0; i < 6; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(captchaText);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !captchaInput) {
      setError('All fields are required.');
      return;
    }

    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      setError('CAPTCHA does not match. Please try again.');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    setLoading(true);

    try {
      const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${userType === 'student' ? 'student' : 'faculty'}/login`,
        {email,password}
      );
      // console.log(response);
      if(response.status===200){
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        navigate(`/${response.data.role}/dashboard`);
      }
      else{
        setError('Login failed. Please try again.');
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      generateCaptcha();
      setCaptchaInput('');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    setIsModalOpen(true);
  };

  const toggleUserType = (type) => {
    setUserType(type);
  };

  return (
    <>
      <div
        className="h-screen w-screen flex items-center justify-center bg-cover bg-center p-4"
        style={{ backgroundImage: `url(${backImage})` }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white bg-opacity-20 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-sm border border-white/30"
        >
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-6">
            <img 
              src={logo}
              alt="GEHU Logo" 
              className="w-16 h-16 mb-4 rounded-full"
            />
            <h2 className="text-2xl font-bold text-gray-800">Welcome to GEHU</h2>
          </div>

          {/* Improved User Type Toggle */}
          <div className="mb-6">
            <div className="flex border-b border-gray-300 relative">
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
                initial={false}
                animate={{
                  x: userType === 'student' ? '0%' : '100%',
                  width: '50%',
                }}
              />
              
              <button
                type="button"
                onClick={() => toggleUserType('student')}
                className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 relative ${
                  userType === 'student' 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Student
                {userType === 'student' && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"
                    layoutId="activeIndicator"
                  />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => toggleUserType('teacher')}
                className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 relative ${
                  userType === 'teacher' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Teacher
                {userType === 'teacher' && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600"
                    layoutId="activeIndicator"
                  />
                )}
              </button>
            </div>
        
          </div>

          {error && <p className="bg-red-500/50 text-white text-center p-2 rounded-md mb-4 text-sm" aria-live="polite">{error}</p>}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border border-white/40 rounded w-full py-2 px-3 bg-white/50 text-gray-800 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-600"
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border border-white/40 rounded w-full py-2 px-3 pr-10 bg-white/50 text-gray-800 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-600"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="captcha">
                CAPTCHA
              </label>
              <div className="flex items-center space-x-2">
                <span className="select-none flex-grow text-center text-2xl font-bold tracking-widest bg-gray-300/50 border border-white/40 rounded py-1 px-2 text-gray-800" style={{fontFamily: 'monospace'}}>
                  {captcha}
                </span>
                <button type="button" onClick={generateCaptcha} className="p-2 text-gray-700 hover:text-blue-600" aria-label="Refresh CAPTCHA">
                  <FiRefreshCw size={20} />
                </button>
              </div>
              <input
                className="mt-2 shadow appearance-none border border-white/40 rounded w-full py-2 px-3 bg-white/50 text-gray-800 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-600"
                id="captcha"
                type="text"
                placeholder="Fill given Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                  userType === 'student' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? <FiLoader className="animate-spin mr-2" /> : 'Sign In'}
              </motion.button>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="inline-block align-baseline font-bold text-sm text-blue-800 hover:text-blue-900 mt-4"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Modal for Forgot Password */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Forgot Password</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Reset password email sent');
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Send Instructions
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;