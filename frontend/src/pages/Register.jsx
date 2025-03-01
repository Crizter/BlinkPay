import { useState, useRef } from 'react';
import axios from 'axios';
import scanIris from '../utils/scanIris';

// TODO FIX ENV
// const API_BASE_URL = import.meta.env.VITE_URL; // Use API URL from .env
const API_BASE_URL = "http://localhost:5003/api/";
const Register = ({ goToHome }) => {
  const videoRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    upiId: '',
    irisData: null,
  });
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const irisData = await scanIris(videoRef);
      setFormData((prev) => ({ ...prev, irisData }));
    } catch (error) {
      alert("Iris Scan Failed: " + error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.irisData) return alert('Iris scan is required!');
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}users/register`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        alert('Registration successful!');
        goToHome();
      }
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-3xl font-bold mb-4">Register</h2>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
          />
          <input 
            type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
          />
          <input 
            type="text" name="upiId" placeholder="UPI ID" value={formData.upiId} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
          />

          {/* Video feed for scanning */}
          <div className="flex flex-col items-center">
            <video ref={videoRef} className="w-64 h-48 bg-gray-700 rounded mb-2" autoPlay playsInline />
            <button 
              type="button" onClick={handleScan} 
              className={`w-full py-2 rounded ${isScanning ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              disabled={isScanning}
            >
              {isScanning ? 'Scanning...' : (formData.irisData ? 'Iris Scanned ✅' : 'Scan Iris')}
            </button>
          </div>

          <button 
            type="submit" 
            className={`w-full py-2 ${loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white rounded`} 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
