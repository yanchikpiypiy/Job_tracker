import React, { useState } from 'react';
import styles from './AuthPage.module.css';

export default function AuthPage(){
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <div
      className={`${styles.wrapper} ${
        isRightPanelActive ? styles['right-panel-active'] : ''
      }`}
    >
      {/* Login Container */}
      <div className={styles.container + ' ' + styles.login}>
        <h2>Login</h2>
        <div className={styles.input_field}>
          <input type="text" placeholder="Email" />
        </div>
        <div className={styles.input_field}>
          <input type="text" placeholder="Password" />
        </div>
        <button id="login_button" className={styles.login_button}>Log in</button>
      </div>

      {/* Overlay Container */}
      <div className={styles['overlay-container']}>
        <div className={styles.overlay}>
          <div className={`${styles['overlay-panel']} ${styles['overlay-left']}`}>
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
          <div className={`${styles['overlay-panel']} ${styles['overlay-right']}`}>
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Signup Container */}
      <div className={styles.container + ' ' + styles.signup}>
        <h2>Sign Up</h2>
        <div className={styles.input_field}>
          <input type="text" placeholder="Email" />
        </div>
        <div className={styles.input_field}>
          <input type="text" placeholder="Password" />
        </div>
        <div className={styles.input_field}>
          <input type="text" placeholder="Confirm Password" />
        </div>
        <button id="signup_button" className={styles.signup_button}>Sign Up</button>
      </div>
    </div>
  );
};

