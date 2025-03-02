import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import "./Register.css"; // Shared CSS file

const UserRegister = () => {
    const [name, setName] = useState("");
    const [upiId, setUpiId] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const [isScanned, setIsScanned] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const webcamRef = useRef(null);

    const captureImage = useCallback(() => {
        setIsScanning(true);
        setTimeout(() => {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc);
            setIsScanned(true);
            setIsScanning(false);
        }, 2000);
    }, [webcamRef]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !upiId || !image) {
            setMessage("All fields are required!");
            return;
        }
    
        // Convert base64 image to a Blob
        const base64Response = await fetch(image);
        const blob = await base64Response.blob();
        
        // Create a File from the Blob with unique file name
        const imageFile = new File([blob], `user_${name.replace(/\s+/g, '_')}_${Date.now()}.png`, { type: "image/png" });
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("upi_id", upiId);
        formData.append("image", imageFile); // Now appending a File object with unique naming
    
        try {
            const response = await fetch("http://127.0.0.1:8000/register_user/", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error("Error:", error);
            setMessage("Error connecting to API.");
        }
    };

    return (
        <div className="register-container">
            <h2>User Registration</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                />

                <div className="webcam-container">
                    {!isScanned ? (
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/png"
                            className={`webcam-preview ${isScanning ? "scanning-effect" : ""}`}
                        />
                    ) : (
                        <p className="scan-message">🔵 Iris Scanned Successfully ✅</p>
                    )}
                </div>

                {!isScanned ? (
                    <button type="button" onClick={captureImage} disabled={isScanning}>
                        {isScanning ? "Scanning..." : "Scan Iris"}
                    </button>
                ) : (
                    <button type="button" onClick={() => { setImage(null); setIsScanned(false); }}>
                        Retake Scan
                    </button>
                )}

                <button type="submit">Register</button>
                <p>{message}</p>
            </form>
        </div>
    );
};

export default UserRegister;