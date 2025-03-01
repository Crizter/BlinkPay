import { useEffect, useState } from "react";

const useEyeTracking = () => {
  const [tracker, setTracker] = useState(null);
  const [gazeData, setGazeData] = useState(null);

  useEffect(() => {
    if (window.SeeSo) {
      const licenseKey = "dev_scn1s72kw7scsjgwj5ebr270t5nrmntouv8z7ahw";
      const gazeTracker = new window.SeeSo.GazeTracker();

      gazeTracker.init(licenseKey, (trackerInstance) => {
        setTracker(trackerInstance);

        trackerInstance.startTracking((gazeInfo) => {
          setGazeData(gazeInfo);
        });
      });

      return () => trackerInstance?.stopTracking();
    }
  }, []);

  return gazeData;
};

export default useEyeTracking;