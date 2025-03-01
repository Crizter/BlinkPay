import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const scanIris = (videoRef) => {
  return new Promise((resolve, reject) => {
    if (!videoRef.current) {
      return reject("No video element found!");
    }

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks.length) return reject("No face detected");

      const faceLandmarks = results.multiFaceLandmarks[0];

      const leftIris = [
        { x: faceLandmarks[468].x, y: faceLandmarks[468].y },
        { x: faceLandmarks[469].x, y: faceLandmarks[469].y },
        { x: faceLandmarks[470].x, y: faceLandmarks[470].y },
        { x: faceLandmarks[471].x, y: faceLandmarks[471].y },
      ];

      const rightIris = [
        { x: faceLandmarks[473].x, y: faceLandmarks[473].y },
        { x: faceLandmarks[474].x, y: faceLandmarks[474].y },
        { x: faceLandmarks[475].x, y: faceLandmarks[475].y },
        { x: faceLandmarks[476].x, y: faceLandmarks[476].y },
      ];

      resolve({ leftIris, rightIris });
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  });
};

// ✅ Export it as a default function
export default scanIris;
