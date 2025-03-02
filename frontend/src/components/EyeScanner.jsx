import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const EyeScanner = ({ mode }) => {
    const webcamRef = useRef(null);
    const [message, setMessage] = useState("");

    const captureAndSend = async () => {
        const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
            setMessage("Failed to capture image. Try again.");
            return;
        }

        // Convert base64 image to File object
        const blob = await fetch(imageSrc).then((res) => res.blob());
        const file = new File([blob], "eye_scan.jpg", { type: "image/jpeg" });

        const formData = new FormData();
        formData.append("image", file);

        if (mode === "register") {
            formData.append("name", "abhay"); // Change this to a real name input
        }

        // Define API endpoint
        const endpoint = mode === "register"
            ? "http://127.0.0.1:8000/register_user/"
            : "http://127.0.0.1:8000/verify_eye/";

        // Send request to backend
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error connecting to API");
        }
    };

    return (
        <div>
            <h2>{mode === "register" ? "Register User" : "Verify Eye"}</h2>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
            <button onClick={captureAndSend}>
                {mode === "register" ? "Register" : "Verify"}
            </button>
            <p>{message}</p>
        </div>
    );
};

export default EyeScanner;
