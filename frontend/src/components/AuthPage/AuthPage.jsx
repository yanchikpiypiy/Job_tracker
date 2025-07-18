import React, { useState } from 'react';
import styles from './AuthPage.module.css';
import { useNavigate } from 'react-router-dom';
export default function AuthPage() {
    const navigate = useNavigate()

    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    // State for login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // State for signup form
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUpClick = () => setIsRightPanelActive(true);
    const handleSignInClick = () => setIsRightPanelActive(false);

    async function loginUser(credentials) {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/auth/token/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Login failed");

            console.log("Login success:", data);

            navigate("/dashboard")
            // Save token or redirect user
        } catch (err) {
            console.error(err.message);
        }
    }

  async function signupUser(credentials) {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/users/", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Signup failed");

      console.log("Signup success:", data);
      // Optionally log user in after signup
    } catch (err) {
      console.error(err.message);
    }
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginUser({ email: loginEmail, password: loginPassword });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    signupUser({ email: signupEmail, password: signupPassword });
  };

  return (
    <div className={`${styles.wrapper} ${isRightPanelActive ? styles['right-panel-active'] : ''}`}>

      {/* Login Container */}
      <div className={styles.container + ' ' + styles.login}>
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit} className={styles['megaform']}>
          <div className={styles.input_field}>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.input_field}>
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" id="login_button" className={styles.login_button}>
            Log in
          </button>
        </form>
      </div>

      {/* Overlay Container */}
      <div className={styles['overlay-container']}>
        <div className={styles.overlay}>
          <div className={`${styles['overlay-panel']} ${styles['overlay-left']}`}>
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className={`${styles['overlay-panel']} ${styles['overlay-right']}`}>
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>

      {/* Signup Container */}
      <div className={styles.container + ' ' + styles.signup}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignupSubmit}>
          <div className={styles.input_field}>
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.input_field}>
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.input_field}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" id="signup_button" className={styles.signup_button}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
