import React, { useState,useContext } from 'react';
import styles from './AuthPage.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/UserContext';
export default function AuthPage() {
    const navigate = useNavigate()
    const {login} = useContext(AuthContext)
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

    async function handleLogin(credentials) {
      await login(credentials); // This is async, so we need await
      navigate("/dashboard");   // This runs AFTER login completes
    }
  

    const handleLoginSubmit = (e) => {
      e.preventDefault();
      handleLogin({ email: loginEmail, password: loginPassword });
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
