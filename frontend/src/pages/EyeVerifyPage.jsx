import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import "./Register.css"; // Using the same CSS as Register pages

const EyeVerifyPage = () => {
    const [userData, setUserData] = useState(null);
    const [message, setMessage] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isScanned, setIsScanned] = useState(false);
    const webcamRef = useRef(null);

    const captureImage = useCallback(() => {
        setIsScanning(true);
        setMessage("Scanning iris...");
        
        setTimeout(() => {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                setMessage("Failed to capture image. Please try again.");
                setIsScanning(false);
                return;
            }
            
            verifyEye(imageSrc);
        }, 2000);
    }, [webcamRef]);

    const verifyEye = async (imageSrc) => {
        try {
            // Convert base64 image to File object
            const blob = await fetch(imageSrc).then((res) => res.blob());
            const file = new File([blob], "eye_scan.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);

            // Send request to backend
            const response = await fetch("http://127.0.0.1:8000/verify_eye/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            
            if (data.success) {
                setUserData(data);
                setMessage(`${data.role === "user" ? "User" : "Vendor"} verified successfully!`);
            } else {
                setMessage(data.message || "Verification failed");
                setUserData(null);
            }
            
            setIsScanned(true);
            setIsScanning(false);
        } catch (error) {
            console.error("Error:", error);
            setMessage("Error connecting to API");
            setIsScanning(false);
        }
    };

    const resetScan = () => {
        setIsScanned(false);
        setUserData(null);
        setMessage("");
    };

    return (
        <div className="register-container">
            <h2>Iris Verification</h2>
            
            <div className="webcam-container">
                {!isScanned ? (
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className={`webcam-preview ${isScanning ? "scanning-effect" : ""}`}
                    />
                ) : (
                    <div className="result-container">
                        <p className="scan-message">🔵 Iris Scanned Successfully ✅</p>
                        
                        {userData && (
                            <div className="user-data">
                                <h3>{userData.role === "user" ? "User" : "Vendor"} Details</h3>
                                <p className="data-item"><span>Name:</span> {userData.name}</p>
                                <p className="data-item"><span>UPI ID:</span> {userData.upi_id}</p>
                                <p className="data-item"><span>Role:</span> {userData.role}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {!isScanned ? (
                <button 
                    type="button" 
                    onClick={captureImage} 
                    disabled={isScanning}
                    className={isScanning ? "scanning-btn" : ""}
                >
                    {isScanning ? "Scanning..." : "Scan Iris"}
                </button>
            ) : (
                <button type="button" onClick={resetScan}>
                    New Scan
                </button>
            )}
            
            <p className="message">{message}</p>
        </div>
    );
};

export default EyeVerifyPage;