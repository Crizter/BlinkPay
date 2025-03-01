import { useState, useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const EyeScanAuth = ({ goToHome }) => {
  const videoRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const cameraInstance = useRef(null); // Store camera instance

  // Fetch available cameras
  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId); // Default to first camera
        }
      } catch (error) {
        console.error("Error fetching camera devices:", error);
      }
    }
    getCameras();
  }, []);

  // Stop existing video stream
  const stopVideoStream = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Start scanning process
  const startEyeScan = async () => {
    if (!selectedCamera) {
      alert("No camera selected!");
      return;
    }

    setIsScanning(true);
    stopVideoStream(); // Stop previous video stream

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedCamera }, width: 640, height: 480 }
      });

      videoRef.current.srcObject = stream;

      // Initialize FaceMesh
      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks.length > 0) {
          console.log("Face Landmarks:", results.multiFaceLandmarks[0]);
          // Process eye data here
        }
      });

      // Attach Camera to FaceMesh
      if (cameraInstance.current) cameraInstance.current.stop(); // Stop old camera instance
      cameraInstance.current = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480
      });

      cameraInstance.current.start();
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsScanning(false);
    }
  };

  // Restart video stream when camera selection changes
  useEffect(() => {
    if (selectedCamera) {
      startEyeScan();
    }
  }, [selectedCamera]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Eye Scan Authentication</h2>

      {/* Camera Selection */}
      <label>Select Camera:</label>
      <select
        value={selectedCamera}
        onChange={(e) => setSelectedCamera(e.target.value)}
      >
        {cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
          </option>
        ))}
      </select>

      <br /><br />

      {/* Start Scan Button */}
      <button onClick={startEyeScan} disabled={isScanning}>
        {isScanning ? "Scanning..." : "Start Eye Scan"}
      </button>

      <br /><br />

      {/* Video Preview */}
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "640px", border: "2px solid black" }}></video>

      <br /><br />

      {/* Back to Home */}
      <button onClick={goToHome}>Go Back</button>
    </div>
  );
};

export default EyeScanAuth;
