import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/UserContext";
import SideBar from "../utils/SideBar";
import api from "../context/api";
import styles from "./ProfilePage.module.css";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit3,
    Save,
    X,
    Camera,
    Briefcase,
    GraduationCap,
    Award,
    Globe
} from "lucide-react";

export default function ProfilePage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [editedProfile, setEditedProfile] = useState({
        username: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        title: '',
        company: '',
        experience: '',
        education: '',
        skills: []
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Load user data when available
    useEffect(() => {
        if (user) {
            setEditedProfile({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                title: user.title || '',
                company: user.company || '',
                experience: user.experience || '',
                education: user.education || '',
                skills: user.skills || []
            });

            // Set profile image preview if exists
            if (user.profile_image) {
                setImagePreview(user.profile_image);
            }
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            // First update text fields
            const response = await api.patch('auth/users/me/', {
                username: editedProfile.username,
                phone: editedProfile.phone,
                location: editedProfile.location,
                bio: editedProfile.bio,
                title: editedProfile.title,
                company: editedProfile.company,
                experience: editedProfile.experience,
                education: editedProfile.education,
                skills: editedProfile.skills
            });

            // If there's a new image, upload it separately
            if (selectedImage) {
                const formData = new FormData();
                formData.append('profile_image', selectedImage);

                try {
                    await api.patch('auth/users/me/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } catch (imgError) {
                    console.error('Error uploading image:', imgError);
                    setError('Profile updated but image upload failed');
                }
            }

            console.log('Profile updated:', response.data);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setSelectedImage(null);

            // Refresh user data
            const userResponse = await api.get('auth/users/me/');
            // You might want to update the user context here

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            console.error('Error response:', err.response?.data);

            // Handle different error formats
            let errorMessage = 'Failed to update profile. Please try again.';
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                } else {
                    // Handle field-specific errors
                    const errors = Object.entries(err.response.data)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('; ');
                    errorMessage = errors || errorMessage;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset to original user data
        if (user) {
            setEditedProfile({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                title: user.title || '',
                company: user.company || '',
                experience: user.experience || '',
                education: user.education || '',
                skills: user.skills || []
            });

            // Reset image preview
            if (user.profile_image) {
                setImagePreview(user.profile_image);
            } else {
                setImagePreview(null);
            }
            setSelectedImage(null);
        }
        setIsEditing(false);
        setError(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    const getLastLoginTime = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (authLoading) {
        return <div className={styles.loading}>Loading profile...</div>;
    }

    if (!user) {
        return <div className={styles.loading}>Please log in to view your profile.</div>;
    }

    return (
        <div className={styles.container}>
            <SideBar />

            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.headerTitle}>My Profile</h1>
                    <p className={styles.headerSubtitle}>
                        Manage your personal information and preferences
                    </p>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className={styles.editButton}
                    >
                        <Edit3 size={16} />
                        Edit Profile
                    </button>
                ) : (
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleCancel}
                            className={styles.cancelButton}
                            disabled={loading}
                        >
                            <X size={16} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={styles.saveButton}
                            disabled={loading}
                        >
                            <Save size={16} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            {/* Messages */}
            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            {/* Profile Content */}
            <div className={styles.contentGrid}>
                {/* Left Column - Profile Card */}
                <div className={styles.profileCard}>
                    {/* Profile Image */}
                    <div className={styles.profileImageContainer}>
                        <img
                            src={imagePreview || "/Io_icon.png"}
                            alt="Profile"
                            className={styles.profileImage}
                        />
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    id="profile-image-input"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="profile-image-input"
                                    className={styles.cameraButton}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Camera size={16} />
                                </label>
                            </>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className={styles.basicInfo}>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedProfile.username}
                                onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                                className={styles.usernameInput}
                            />
                        ) : (
                            <h2 className={styles.userName}>
                                {editedProfile.username || 'User Name'}
                            </h2>
                        )}

                        <div className={styles.statusBadge}>
                            <div className={styles.statusDot}></div>
                            Online
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                            <Mail size={16} style={{ color: '#64748b' }} />
                            <span className={styles.contactText}>
                                {editedProfile.email || 'email@example.com'}
                            </span>
                        </div>

                        <div className={styles.contactItem}>
                            <Phone size={16} style={{ color: '#64748b' }} />
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editedProfile.phone}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                    placeholder="Phone number"
                                    className={styles.contactInput}
                                />
                            ) : (
                                <span className={styles.contactText}>
                                    {editedProfile.phone || 'Add phone number'}
                                </span>
                            )}
                        </div>

                        <div className={styles.contactItem}>
                            <MapPin size={16} style={{ color: '#64748b' }} />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedProfile.location}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                                    placeholder="Location"
                                    className={styles.contactInput}
                                />
                            ) : (
                                <span className={styles.contactText}>
                                    {editedProfile.location || 'Add location'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Detailed Information */}
                <div className={styles.rightColumn}>
                    {/* About Section */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <User size={20} style={{ color: '#8b5cf6' }} />
                            About
                        </h3>

                        {isEditing ? (
                            <textarea
                                value={editedProfile.bio}
                                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className={styles.bioTextarea}
                            />
                        ) : (
                            <p className={styles.bioText}>
                                {editedProfile.bio || 'Add a bio to tell people more about yourself and your professional background.'}
                            </p>
                        )}
                    </div>

                    {/* Professional Information */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <Briefcase size={20} style={{ color: '#8b5cf6' }} />
                            Professional Information
                        </h3>

                        <div className={styles.formGrid}>
                            <div>
                                <label className={styles.label}>Job Title</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.title}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, title: e.target.value })}
                                        placeholder="e.g. Software Engineer"
                                        className={styles.input}
                                    />
                                ) : (
                                    <p className={styles.fieldValue}>
                                        {editedProfile.title || 'Not specified'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={styles.label}>Company</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.company}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, company: e.target.value })}
                                        placeholder="Company name"
                                        className={styles.input}
                                    />
                                ) : (
                                    <p className={styles.fieldValue}>
                                        {editedProfile.company || 'Not specified'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={styles.formField}>
                            <label className={styles.label}>Experience Level</label>
                            {isEditing ? (
                                <select
                                    value={editedProfile.experience}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, experience: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="">Select experience level</option>
                                    <option value="entry">Entry Level (0-2 years)</option>
                                    <option value="mid">Mid Level (2-5 years)</option>
                                    <option value="senior">Senior Level (5-10 years)</option>
                                    <option value="lead">Lead/Principal (10+ years)</option>
                                </select>
                            ) : (
                                <p className={styles.fieldValue}>
                                    {editedProfile.experience || 'Not specified'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <Award size={20} style={{ color: '#8b5cf6' }} />
                            Account Information
                        </h3>

                        <div className={styles.accountInfoList}>
                            <div className={styles.accountInfoItem}>
                                <span className={styles.accountLabel}>Member since</span>
                                <span className={styles.accountValue}>
                                    {formatDate(user.created_at)}
                                </span>
                            </div>

                            <div className={styles.accountInfoItem}>
                                <span className={styles.accountLabel}>Account status</span>
                                <span className={styles.accountValueActive}>Active</span>
                            </div>

                            <div className={styles.accountInfoItem}>
                                <span className={styles.accountLabel}>Last login</span>
                                <span className={styles.accountValue}>
                                    {getLastLoginTime()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
