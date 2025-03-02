import React, { useEffect, useRef, useState } from "react";
import * as faceMesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";

// Backend URL (Set here for easy changes)
const BACKEND_URL = "http://localhost:5003";

const EyeScanAuth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [isScanning, setIsScanning] = useState(true); // To control scanning state

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Face Mesh
    const faceMeshModel = new faceMesh.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMeshModel.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshModel.onResults(onResults);

    // Start Camera
    const newCamera = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        if (isScanning) {
          await faceMeshModel.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    newCamera.start();
    setCamera(newCamera);

    return () => {
      if (newCamera) newCamera.stop();
    };
  }, [isScanning]); // Reacts to scanning state

  // Process face landmarks
  const onResults = (results) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const detectedLandmarks = results.multiFaceLandmarks[0];
      setLandmarks(detectedLandmarks);
      console.log("📍 Face Landmarks:", detectedLandmarks);

      // Draw landmarks
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      detectedLandmarks.forEach((point) => {
        const x = point.x * canvasRef.current.width;
        const y = point.y * canvasRef.current.height;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 2, 0, 2 * Math.PI);
        canvasCtx.fillStyle = "red";
        canvasCtx.fill();
      });

      // Stop scanning after first detection
      setIsScanning(false);
    } else {
      console.warn("No face detected. Try again.");
    }
  };

  // Send Eye Scan Data to Backend
  const authenticateUser = async () => {
    if (!landmarks) {
      alert("No face detected. Please try again.");
      return;
    }

    console.log("✅ Sending Face Landmarks:", landmarks);

    try {
      const response = await fetch(`${BACKEND_URL}/api/scan-eye`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ landmarks }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication failed");
      }

      const data = await response.json();
      setAuthStatus(`✅ Authentication Successful: ${data.message}`);
      console.log("Authentication Success:", data);
    } catch (error) {
      console.error("❌ Error authenticating:", error);
      setAuthStatus("❌ Authentication Failed");
    }

    // Restart scanning after 5 seconds
    setTimeout(() => setIsScanning(true), 5000);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Eye Scan Authentication</h2>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ border: "1px solid black" }} />
      <button onClick={authenticateUser} style={{ marginTop: "10px", padding: "10px" }}>
        Start Eye Scan
      </button>
      {authStatus && <p>{authStatus}</p>}
    </div>
  );
};

export default EyeScanAuth;
