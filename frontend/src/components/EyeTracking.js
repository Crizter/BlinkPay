import { useEffect, useState } from "react";
import * as SeeSo from "seeso";  // Correct import

const API_KEY = "dev_scn1s72kw7scsjgwj5ebr270t5nrmntouv8z7ahw"; 

export const useEyeTracking = () => {
  const [tracker, setTracker] = useState(null);
  const [eyeData, setEyeData] = useState(null);

  useEffect(() => {
    const initSeeso = async () => {
      try {
        const gazeTracker = new SeeSo.GazeTracker();
        await gazeTracker.init(API_KEY);
        setTracker(gazeTracker);

        gazeTracker.setGazeCallback((gazeInfo) => {
          setEyeData(gazeInfo);
        });
      } catch (error) {
        console.error("Seeso Initialization Failed:", error);
      }
    };

    initSeeso();

    return () => tracker?.deinit();
  }, []);

  return eyeData;
};
