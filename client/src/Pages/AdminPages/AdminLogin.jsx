import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiRefreshCw, FiLoader, FiX } from 'react-icons/fi';
import backImage from '../../assets/GEHU-Dehradun-1abd6f9c.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ForgotPasswordModal = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Reset Credentials</h3>
      <p className="text-gray-600 mb-6">
        For security reasons, password resets must be handled by an administrator. Please contact the administrative office to have your credentials reset.
      </p>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        aria-label="Close modal"
      >
        <FiX size={24} />
      </button>
      <button
        onClick={onClose}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300"
      >
        Got it
      </button>
    </motion.div>
  </motion.div>
);

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, { email, password });
      if(response.status===200){
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role','admin');
        navigate('/admin');
      }
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
      generateCaptcha();
      setCaptchaInput('');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? <FiLoader className="animate-spin mr-2" /> : 'Sign In'}
              </motion.button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-block align-baseline font-bold text-sm text-blue-800 hover:text-blue-900 mt-4"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && <ForgotPasswordModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default AdminLogin;