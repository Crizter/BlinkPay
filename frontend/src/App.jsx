import { useState } from "react";
import Home from "./pages/Home";
import EyeScanAuth from "./pages/EyeScanAuth";
// import PaymentPage from "./pages/PaymentPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CameraSelector from "./components/CameraSelector"; // Import CameraSelector

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "eye-scan-auth":
        return <EyeScanAuth goToHome={() => setCurrentPage("home")} />;
      // case "payment":
        // return <PaymentPage goToHome={() => setCurrentPage("home")} />; 
      case "register":
        return <Register goToHome={() => setCurrentPage("home")} />;
      case "login":
        return <Login goToHome={() => setCurrentPage("home")} />;
      case "camera-selector":
        return <CameraSelector goToHome={() => setCurrentPage("home")} />; // Added CameraSelector
      default:
        return <Home goToPage={setCurrentPage} />;
    }
  };

  return <div>{renderPage()}</div>;
};

export default App;
