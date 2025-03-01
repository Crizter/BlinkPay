const PaymentPage = ({ goToHome }) => {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Make a Payment</h1>
        <p style={styles.description}>
          Confirm your payment using BlinkPay eye recognition.
        </p>
        <button style={styles.button}>Proceed with Payment</button>
        <br />
        <button onClick={goToHome} style={styles.backButton}>
          Back to Home
        </button>
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
      fontSize: "28px",
      color: "#444",
    },
    description: {
      fontSize: "18px",
      marginBottom: "20px",
    },
    button: {
      padding: "12px 20px",
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    backButton: {
      marginTop: "20px",
      padding: "10px 15px",
      fontSize: "14px",
      color: "#fff",
      backgroundColor: "#dc3545",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };
  
  export default PaymentPage;
  