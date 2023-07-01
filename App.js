import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '5px',
  },
  input: {
    marginBottom: '10px',
    padding: '5px',
    width: '100%',
  },
  button: {
    padding: '10px',
    width: '100%',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const App = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [otpMessage, setOTPMessage] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/api/saveEmail', { email: email })
      .then((response) => {
        setEmailMessage(response.data.message);
      })
      .catch((error) => {
        setEmailMessage('Failed to save email and OTP');
      });
  };


  const handleOTPSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/api/verifyOTP', { email: email, otp: otp })
      .then((response) => {
        setOTPMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setOTPMessage('Failed to verify OTP');
      });
  };

  return (
    <div style={styles.container}>
      <h1>OTP Manager</h1>
      <div>
        <form onSubmit={handleEmailSubmit}>
          <label>Email:</label>
          <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button style={styles.button} type="submit">Submit</button>
        </form>

        <h1>{emailMessage}</h1>

        <form onSubmit={handleOTPSubmit}>
          <label>OTP:</label>
          <input style={styles.input} type="text" value={otp} onChange={(e) => setOTP(e.target.value)} required />
          <button style={styles.button} type="submit">Submit</button>
        </form>

        <h1>{otpMessage}</h1>
      </div>
    </div>
  )
}

export default App;