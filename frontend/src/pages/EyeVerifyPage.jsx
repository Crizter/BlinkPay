import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import "./Register.css"; // Can use the same styling

const EyeVerifyPage = () => {
    const [verificationResult, setVerificationResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const webcamRef = useRef(null);

    const captureImage = useCallback(() => {
        setIsScanning(true);
        setMessage("Scanning...");
        setTimeout(() => {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc);
            setIsScanning(false);
            setMessage("Processing...");
            verifyImage(imageSrc);
        }, 2000);
    }, [webcamRef]);

    const verifyImage = async (imageSrc) => {
        try {
            // Convert base64 image to a Blob
            const base64Response = await fetch(imageSrc);
            const blob = await base64Response.blob();
            
            // Create a File from the Blob
            const imageFile = new File([blob], `verification_${Date.now()}.png`, { type: "image/png" });
            
            const formData = new FormData();
            formData.append("image", imageFile);
            
            const response = await fetch("http://127.0.0.1:8000/verify_eye/", {
                method: "POST",
                body: formData,
            });
            
            const data = await response.json();
            setVerificationResult(data);
            setMessage(data.message || "Verification complete");
        } catch (error) {
            console.error("Error:", error);
            setMessage("Error connecting to API.");
            setVerificationResult(null);
        }
    };

    const resetVerification = () => {
        setVerificationResult(null);
        setImage(null);
        setMessage("");
    };

    return (
        <div className="register-container">
            <h2>Eye Verification</h2>
            
            <div className="webcam-container">
                {!image ? (
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        className={`webcam-preview ${isScanning ? "scanning-effect" : ""}`}
                    />
                ) : (
                    <div className="result-container">
                        {verificationResult && verificationResult.success ? (
                            <div className="success-result">
                                <p className="scan-message">✅ Verified Successfully!</p>
                                <div className="user-details">
                                    <p><strong>Role:</strong> {verificationResult.role}</p>
                                    <p><strong>Name:</strong> {verificationResult.name}</p>
                                    <p><strong>UPI ID:</strong> {verificationResult.upi_id}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="error-message">❌ {verificationResult?.message || "Verification failed"}</p>
                        )}
                    </div>
                )}
            </div>
            
            <p className="status-message">{message}</p>
            
            {!image ? (
                <button 
                    type="button" 
                    onClick={captureImage} 
                    disabled={isScanning}
                    className="scan-button"
                >
                    {isScanning ? "Scanning..." : "Scan Iris"}
                </button>
            ) : (
                <button 
                    type="button" 
                    onClick={resetVerification}
                    className="reset-button"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default EyeVerifyPage;