import React, { useState, useEffect } from "react";

const CameraSelector = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // Fetch available cameras
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId); // Default to first camera
        }
      })
      .catch((err) => console.error("Error fetching cameras:", err));
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      // Access selected camera
      navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCamera } })
        .then((stream) => {
          console.log("Camera stream received:", stream);
          setStream(stream);
        })
        .catch((err) => console.error("Error accessing camera:", err));
    }
  }, [selectedCamera]);

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  return (
    <div>
      <label>Select Camera:</label>
      <select value={selectedCamera} onChange={handleCameraChange}>
        {cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
          </option>
        ))}
      </select>

      <video
        autoPlay
        ref={(video) => {
          if (video && stream) {
            video.srcObject = stream;
          }
        }}
        style={{ width: "100%", marginTop: "10px" }}
      />
    </div>
  );
};

export default CameraSelector;
