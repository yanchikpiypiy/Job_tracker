import React, { useState } from "react";
import SideBar from "../utils/SideBar";
import { Moon, Bell, Mail, Lock, User, Globe, Trash2 } from "lucide-react";
import styles from "./Settings.module.css";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
    const { darkMode, toggleDarkMode } = useTheme();

    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        applicationAlerts: true,
        interviewReminders: true,
        weeklyDigest: false,
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className={styles.layout}>
            <SideBar />
            <div className={styles.contentMain}>
                <div className={styles.settingsContainer}>
                    <div className={styles.settingsHeader}>
                        <h1 className={styles.settingsTitle}>⚙️ Settings</h1>
                        <p className={styles.settingsSubtitle}>Manage your account preferences and application settings</p>
                    </div>

                    {/* Appearance Section */}
                    <div className={styles.settingsSection}>
                        <div className={styles.sectionTitle}>
                            <Moon size={20} />
                            <h2>Appearance</h2>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h3>Dark Mode</h3>
                                <p>Switch between light and dark themes</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={toggleDarkMode}
                                />
                                <span className={styles.toggleSlider}></span>
                            </label>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className={styles.settingsSection}>
                        <div className={styles.sectionTitle}>
                            <Bell size={20} />
                            <h2>Notifications</h2>
                        </div>

                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h3>Email Notifications</h3>
                                <p>Receive email updates about your applications</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={() => handleToggle('emailNotifications')}
                                />
                                <span className={styles.toggleSlider}></span>
                            </label>
                        </div>

                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h3>Push Notifications</h3>
                                <p>Get browser notifications for important updates</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotifications}
                                    onChange={() => handleToggle('pushNotifications')}
                                />
                                <span className={styles.toggleSlider}></span>
                            </label>
                        </div>

                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h3>Application Status Alerts</h3>
                                <p>Get notified when application status changes</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={settings.applicationAlerts}
                                    onChange={() => handleToggle('applicationAlerts')}
                                />
                                <span className={styles.toggleSlider}></span>
                            </label>
                        </div>

                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h3>Interview Reminders</h3>
                                <p>Receive reminders before scheduled interviews</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={settings.interviewReminders}
                                    onChange={() => handleToggle('interviewReminders')}
                                />
                                <span className={styles.toggleSlider}></span>
                            </label>
                        </div>

                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h3>Weekly Digest</h3>
                                <p>Get a summary of your applications every week</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={settings.weeklyDigest}
                                    onChange={() => handleToggle('weeklyDigest')}
                                />
                                <span className={styles.toggleSlider}></span>
                            </label>
                        </div>
                    </div>

                    {/* Account Section */}
                    <div className={styles.settingsSection}>
                        <div className={styles.sectionTitle}>
                            <User size={20} />
                            <h2>Account</h2>
                        </div>

                        <div className={styles.settingItemButton}>
                            <div className={styles.settingInfo}>
                                <h3>Change Password</h3>
                                <p>Update your account password</p>
                            </div>
                            <button className={`${styles.settingsBtn} ${styles.primary}`}>
                                <Lock size={16} />
                                Change
                            </button>
                        </div>

                        <div className={styles.settingItemButton}>
                            <div className={styles.settingInfo}>
                                <h3>Email Address</h3>
                                <p>Update your email for notifications</p>
                            </div>
                            <button className={`${styles.settingsBtn} ${styles.primary}`}>
                                <Mail size={16} />
                                Update
                            </button>
                        </div>

                        <div className={styles.settingItemButton}>
                            <div className={styles.settingInfo}>
                                <h3>Language</h3>
                                <p>Choose your preferred language</p>
                            </div>
                            <button className={`${styles.settingsBtn} ${styles.primary}`}>
                                <Globe size={16} />
                                English
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className={`${styles.settingsSection} ${styles.dangerSection}`}>
                        <div className={styles.sectionTitle}>
                            <Trash2 size={20} />
                            <h2>Danger Zone</h2>
                        </div>

                        <div className={styles.settingItemButton}>
                            <div className={styles.settingInfo}>
                                <h3>Delete Account</h3>
                                <p>Permanently delete your account and all data</p>
                            </div>
                            <button className={`${styles.settingsBtn} ${styles.danger}`}>
                                <Trash2 size={16} />
                                Delete Account
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className={styles.settingsFooter}>
                        <button className={styles.saveButton}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
