import React, { useState } from "react";
import UserRegister from "./pages/UserRegister";
import VendorRegister from "./pages/VendorRegister";
import EyeVerifyPage from "./pages/EyeVerifyPage";
import "./App.css";

function App() {
    const [currentPage, setCurrentPage] = useState("home");

    return (
        <div className="app-container">
            <nav className="app-nav">
                <button onClick={() => setCurrentPage("home")}>Home</button>
                <button onClick={() => setCurrentPage("user")}>User Register</button>
                <button onClick={() => setCurrentPage("vendor")}>Vendor Register</button>
                <button onClick={() => setCurrentPage("verify")}>Eye Verify</button>
            </nav>

            <main className="app-main">
                {currentPage === "home" && (
                    <div className="home-container">
                        <h1>Welcome to BlinkPay</h1>
                        <p>Register as a User or Vendor to get started.</p>
                    </div>
                )}
                {currentPage === "user" && <UserRegister />}
                {currentPage === "vendor" && <VendorRegister />}
                {currentPage === "verify" && <EyeVerifyPage />}
            </main>
        </div>
    );
}

export default App;