import { useState, useEffect } from "react";
import Home from "./pages/Home";
import EyeScanAuth from "./pages/EyeScanAuth";
import PaymentPage from "./pages/PaymentPage";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  const navigate = (newPath) => {
    window.history.pushState({}, "", newPath);
    window.dispatchEvent(new Event("popstate")); // Triggers re-render
  };

  const getPage = () => {
    switch (path) {
      case "/eye-scan-auth":
        return <EyeScanAuth />;
      case "/payment":
        return <PaymentPage />;
      case "/register":
        return <Register navigate={navigate} />;
      case "/login":
        return <Login navigate={navigate} />;
      default:
        return <Home />;
    }
  };

  return <div>{getPage()}</div>;
};

export default App;
