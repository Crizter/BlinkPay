import React from 'react';
import './Home.css'; // Import custom CSS

const Home = ({ goToPage }) => {
    return (
        <div className="home-container">
            <h1>Welcome to BlinkPay</h1>
            <p>Experience seamless, hands-free payments using eye-scanning technology!</p>
            <div className="navbar">
                <button onClick={() => goToPage("eye-scan-auth")}>Authenticate with Eye Scan</button>
                <button onClick={() => goToPage("payment")}>Proceed to Payment</button>
            </div>
        </div>
    );
};

export default Home;
