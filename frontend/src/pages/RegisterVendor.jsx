import { useState, useRef } from 'react';
import axios from 'axios';
import scanIris from '../utils/scanIris';

// const API_BASE_URL = import.meta.env.VITE_URL; // Ensure it is correctly set in .env
const API_BASE_URL = "http://localhost:5003/api/";
const RegisterVendor = ({ goToHome }) => {
  const videoRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    upiId: '',
    bankAccount: '',
    irisData: null, // Iris scan data
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
    console.log("Submitting Form Data:", formData); // Debugging log

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}vendors/register`, 
        formData, 
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("Server Response:", response.data); // Debugging log
      if (response.data.success) {
        alert('Vendor Registered Successfully!');
        goToHome();
      }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message); // Log server error

      alert('Registration Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-3xl font-bold mb-4">Register as Vendor</h2>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500" />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500" />
          <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500" />
          <input type="text" name="upiId" placeholder="UPI ID" value={formData.upiId} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500" />
          <input type="text" name="bankAccount" placeholder="Bank Account" value={formData.bankAccount} onChange={handleChange} required 
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500" />

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

export default RegisterVendor;
