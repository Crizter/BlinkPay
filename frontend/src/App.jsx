import { useState } from "react";
import Home from "./pages/Home";
import EyeScanAuth from "./pages/EyeScanAuth";
import PaymentPage from "./pages/PaymentPage";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "eye-scan-auth":
        return <EyeScanAuth goToHome={() => setCurrentPage("home")} />;
      case "payment":
        return <PaymentPage goToHome={() => setCurrentPage("home")} />;
      default:
        return <Home goToPage={setCurrentPage} />;
    }
  };

  return <div>{renderPage()}</div>;
};

export default App;
