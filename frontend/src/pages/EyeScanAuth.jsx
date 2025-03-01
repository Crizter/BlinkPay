import React, { useState } from "react";

const EyeScanAuth = () => {
  const [scanStatus, setScanStatus] = useState("");

  const handleEyeScan = async () => {
    try {
      const eyeScanData = {
        userId: "someUserId", // Replace with actual user ID
        irisHash: "generatedHash", // Replace with real hash from Seeso SDK
        eyeMovementPattern: "patternData", // Replace with actual eye movement pattern
      };
  
      const response = await fetch("http://localhost:5000/api/eye/verify-eye", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eyeScanData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("✅ Authentication Successful!");
      } else {
        alert("❌ Eye Scan does not match!");
      }
    } catch (error) {
      console.error("Error verifying eye scan:", error);
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Eye Scan Authentication</h2>
      <button style={styles.scanButton} onClick={handleEyeScan}>
        Start Eye Scan
      </button>
      {scanStatus && <p style={styles.status}>{scanStatus}</p>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#121212",
    color: "#ffffff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  scanButton: {
    backgroundColor: "#00D4FF",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "8px",
  },
  status: {
    marginTop: "20px",
    fontSize: "16px",
  },
};

export default EyeScanAuth;
