import { useState, useRef } from 'react';
import axios from 'axios';
import scanIris from '../utils/scanIris';
import './RegisterVendor.css';

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

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}vendors/register`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        alert('Vendor Registered Successfully!');
        goToHome();
      }
    } catch (error) {
      alert('Registration Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-vendor-container">
      <h2 className="register-vendor-title">Register as Vendor</h2>

      <div className="register-vendor-box">
        <form onSubmit={handleSubmit} className="register-vendor-form">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required />
          <input type="text" name="upiId" placeholder="UPI ID" value={formData.upiId} onChange={handleChange} required />
          <input type="text" name="bankAccount" placeholder="Bank Account" value={formData.bankAccount} onChange={handleChange} required />

          {/* Video feed for scanning */}
          <div className="video-container">
            <video ref={videoRef} className="video-feed" autoPlay playsInline />
            <button type="button" onClick={handleScan} className="scan-button" disabled={isScanning}>
              {isScanning ? 'Scanning...' : (formData.irisData ? 'Iris Scanned ✅' : 'Scan Iris')}
            </button>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterVendor;
