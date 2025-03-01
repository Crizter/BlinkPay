const Home = ({ goToPage }) => {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome to BlinkPay</h1>
        <p style={styles.description}>
          Experience seamless, hands-free payments using eye-scanning technology!
        </p>
  
        <div style={styles.navbar}>
          <button onClick={() => goToPage("eye-scan-auth")} style={styles.button}>
            Authenticate with Eye Scan
          </button>
          <button onClick={() => goToPage("payment")} style={styles.button}>
            Proceed to Payment
          </button>
        </div>
      </div>
    );
  };
  
  const styles = {
    container: {
      textAlign: "center",
      padding: "50px",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      fontSize: "32px",
      color: "#333",
    },
    description: {
      fontSize: "18px",
      margin: "10px 0 30px",
    },
    navbar: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
    },
    button: {
      padding: "12px 20px",
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#007bff",
      textDecoration: "none",
      borderRadius: "5px",
      cursor: "pointer",
      border: "none",
    },
  };
  
  export default Home;
  