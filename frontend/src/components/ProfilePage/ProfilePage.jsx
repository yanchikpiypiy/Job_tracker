import { useContext, useState } from "react";
import { AuthContext } from "../context/UserContext";
import SideBar from "../utils/SideBar"
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
	Globe,
    Sidebar
} from "lucide-react";

export default function ProfilePage() {
	const { user } = useContext(AuthContext);
	const [isEditing, setIsEditing] = useState(false);
	const [editedProfile, setEditedProfile] = useState({
		username: user?.username || '',
		email: user?.email || '',
		phone: '',
		location: '',
		bio: '',
		title: '',
		company: '',
		experience: '',
		education: '',
		skills: []
	});

	const handleSave = () => {
		// Here you would typically send the data to your backend
		console.log('Saving profile:', editedProfile);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedProfile({
			username: user?.username || '',
			email: user?.email || '',
			phone: '',
			location: '',
			bio: '',
			title: '',
			company: '',
			experience: '',
			education: '',
			skills: []
		});
		setIsEditing(false);
	};

	return (
		<div style={{ 
			padding: '24px',
			backgroundColor: '#f8fafc',
			minHeight: '100vh',
			marginLeft: '250px'
		}}>

			{/* Header */}
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: '32px'
			}}>
				<SideBar></SideBar>
				<div>
					<h1 style={{
						fontSize: '28px',
						fontWeight: '600',
						color: '#1e293b',
						margin: '0 0 8px 0'
					}}>
						My Profile
					</h1>
					<p style={{
						color: '#64748b',
						margin: 0,
						fontSize: '16px'
					}}>
						Manage your personal information and preferences
					</p>
				</div>

				{!isEditing ? (
					<button
						onClick={() => setIsEditing(true)}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							padding: '12px 24px',
							backgroundColor: '#8b5cf6',
							color: 'white',
							border: 'none',
							borderRadius: '8px',
							fontSize: '14px',
							fontWeight: '500',
							cursor: 'pointer',
							transition: 'background-color 0.2s ease'
						}}
						onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
						onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
					>
						<Edit3 size={16} />
						Edit Profile
					</button>
				) : (
						<div style={{ display: 'flex', gap: '12px' }}>
							<button
								onClick={handleCancel}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									padding: '12px 24px',
									backgroundColor: '#e2e8f0',
									color: '#64748b',
									border: 'none',
									borderRadius: '8px',
									fontSize: '14px',
									fontWeight: '500',
									cursor: 'pointer'
								}}
							>
								<X size={16} />
								Cancel
							</button>
							<button
								onClick={handleSave}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									padding: '12px 24px',
									backgroundColor: '#10b981',
									color: 'white',
									border: 'none',
									borderRadius: '8px',
									fontSize: '14px',
									fontWeight: '500',
									cursor: 'pointer'
								}}
							>
								<Save size={16} />
								Save Changes
							</button>
						</div>
					)}
			</div>

			{/* Profile Content */}
			<div style={{
				display: 'grid',
				gridTemplateColumns: '1fr 2fr',
				gap: '24px',
				maxWidth: '1200px'
			}}>
				{/* Left Column - Profile Card */}
				<div style={{
					backgroundColor: 'white',
					borderRadius: '12px',
					padding: '32px',
					boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
					height: 'fit-content',
					textAlign: 'center'
				}}>
					{/* Profile Image */}
					<div style={{
						position: 'relative',
						width: '120px',
						height: '120px',
						margin: '0 auto 24px'
					}}>
						<img 
							src="public/Io_icon.png" 
							alt="Profile"
							style={{
								width: '100%',
								height: '100%',
								borderRadius: '50%',
								objectFit: 'cover',
								border: '4px solid #e2e8f0'
							}}
						/>
						{isEditing && (
							<button style={{
								position: 'absolute',
								bottom: '8px',
								right: '8px',
								width: '32px',
								height: '32px',
								borderRadius: '50%',
								backgroundColor: '#8b5cf6',
								color: 'white',
								border: 'none',
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}>
								<Camera size={16} />
							</button>
						)}
					</div>

					{/* Basic Info */}
					<div style={{ marginBottom: '24px' }}>
						{isEditing ? (
							<input
								type="text"
								value={editedProfile.username}
								onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
								style={{
									width: '100%',
									padding: '8px 12px',
									border: '1px solid #d1d5db',
									borderRadius: '6px',
									fontSize: '20px',
									fontWeight: '600',
									textAlign: 'center',
									marginBottom: '8px'
								}}
							/>
						) : (
								<h2 style={{
									fontSize: '24px',
									fontWeight: '600',
									color: '#1e293b',
									margin: '0 0 8px 0'
								}}>
									{editedProfile.username || 'User Name'}
								</h2>
							)}

						<div style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '6px',
							backgroundColor: '#dcfce7',
							color: '#16a34a',
							padding: '4px 12px',
							borderRadius: '20px',
							fontSize: '12px',
							fontWeight: '500'
						}}>
							<div style={{
								width: '6px',
								height: '6px',
								borderRadius: '50%',
								backgroundColor: '#16a34a'
							}}></div>
							Online
						</div>
					</div>

					{/* Contact Info */}
					<div style={{ textAlign: 'left', marginBottom: '24px' }}>
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '12px',
							marginBottom: '12px'
						}}>
							<Mail size={16} style={{ color: '#64748b' }} />
							{isEditing ? (
								<input
									type="email"
									value={editedProfile.email}
									onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
									style={{
										flex: 1,
										padding: '6px 8px',
										border: '1px solid #d1d5db',
										borderRadius: '4px',
										fontSize: '14px'
									}}
								/>
							) : (
									<span style={{ color: '#64748b', fontSize: '14px' }}>
										{editedProfile.email || 'email@example.com'}
									</span>
								)}
						</div>

						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '12px',
							marginBottom: '12px'
						}}>
							<Phone size={16} style={{ color: '#64748b' }} />
							{isEditing ? (
								<input
									type="tel"
									value={editedProfile.phone}
									onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
									placeholder="Phone number"
									style={{
										flex: 1,
										padding: '6px 8px',
										border: '1px solid #d1d5db',
										borderRadius: '4px',
										fontSize: '14px'
									}}
								/>
							) : (
									<span style={{ color: '#64748b', fontSize: '14px' }}>
										{editedProfile.phone || 'Add phone number'}
									</span>
								)}
						</div>

						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '12px'
						}}>
							<MapPin size={16} style={{ color: '#64748b' }} />
							{isEditing ? (
								<input
									type="text"
									value={editedProfile.location}
									onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
									placeholder="Location"
									style={{
										flex: 1,
										padding: '6px 8px',
										border: '1px solid #d1d5db',
										borderRadius: '4px',
										fontSize: '14px'
									}}
								/>
							) : (
									<span style={{ color: '#64748b', fontSize: '14px' }}>
										{editedProfile.location || 'Add location'}
									</span>
								)}
						</div>
					</div>
				</div>

				{/* Right Column - Detailed Information */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
					{/* About Section */}
					<div style={{
						backgroundColor: 'white',
						borderRadius: '12px',
						padding: '24px',
						boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
					}}>
						<h3 style={{
							fontSize: '18px',
							fontWeight: '600',
							color: '#1e293b',
							marginBottom: '16px',
							display: 'flex',
							alignItems: 'center',
							gap: '8px'
						}}>
							<User size={20} style={{ color: '#8b5cf6' }} />
							About
						</h3>

						{isEditing ? (
							<textarea
								value={editedProfile.bio}
								onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
								placeholder="Tell us about yourself..."
								rows={4}
								style={{
									width: '100%',
									padding: '12px',
									border: '1px solid #d1d5db',
									borderRadius: '6px',
									fontSize: '14px',
									resize: 'vertical',
									fontFamily: 'inherit'
								}}
							/>
						) : (
								<p style={{
									color: '#64748b',
									lineHeight: '1.6',
									margin: 0
								}}>
									{editedProfile.bio || 'Add a bio to tell people more about yourself and your professional background.'}
								</p>
							)}
					</div>

					{/* Professional Information */}
					<div style={{
						backgroundColor: 'white',
						borderRadius: '12px',
						padding: '24px',
						boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
					}}>
						<h3 style={{
							fontSize: '18px',
							fontWeight: '600',
							color: '#1e293b',
							marginBottom: '16px',
							display: 'flex',
							alignItems: 'center',
							gap: '8px'
						}}>
							<Briefcase size={20} style={{ color: '#8b5cf6' }} />
							Professional Information
						</h3>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
							<div>
								<label style={{
									display: 'block',
									fontSize: '14px',
									fontWeight: '500',
									color: '#374151',
									marginBottom: '6px'
								}}>
									Job Title
								</label>
								{isEditing ? (
									<input
										type="text"
										value={editedProfile.title}
										onChange={(e) => setEditedProfile({...editedProfile, title: e.target.value})}
										placeholder="e.g. Software Engineer"
										style={{
											width: '100%',
											padding: '8px 12px',
											border: '1px solid #d1d5db',
											borderRadius: '6px',
											fontSize: '14px'
										}}
									/>
								) : (
										<p style={{ color: '#64748b', margin: 0 }}>
											{editedProfile.title || 'Not specified'}
										</p>
									)}
							</div>

							<div>
								<label style={{
									display: 'block',
									fontSize: '14px',
									fontWeight: '500',
									color: '#374151',
									marginBottom: '6px'
								}}>
									Company
								</label>
								{isEditing ? (
									<input
										type="text"
										value={editedProfile.company}
										onChange={(e) => setEditedProfile({...editedProfile, company: e.target.value})}
										placeholder="Company name"
										style={{
											width: '100%',
											padding: '8px 12px',
											border: '1px solid #d1d5db',
											borderRadius: '6px',
											fontSize: '14px'
										}}
									/>
								) : (
										<p style={{ color: '#64748b', margin: 0 }}>
											{editedProfile.company || 'Not specified'}
										</p>
									)}
							</div>
						</div>

						<div style={{ marginTop: '16px' }}>
							<label style={{
								display: 'block',
								fontSize: '14px',
								fontWeight: '500',
								color: '#374151',
								marginBottom: '6px'
							}}>
								Experience Level
							</label>
							{isEditing ? (
								<select
									value={editedProfile.experience}
									onChange={(e) => setEditedProfile({...editedProfile, experience: e.target.value})}
									style={{
										width: '100%',
										padding: '8px 12px',
										border: '1px solid #d1d5db',
										borderRadius: '6px',
										fontSize: '14px'
									}}
								>
									<option value="">Select experience level</option>
									<option value="entry">Entry Level (0-2 years)</option>
									<option value="mid">Mid Level (2-5 years)</option>
									<option value="senior">Senior Level (5-10 years)</option>
									<option value="lead">Lead/Principal (10+ years)</option>
								</select>
							) : (
									<p style={{ color: '#64748b', margin: 0 }}>
										{editedProfile.experience || 'Not specified'}
									</p>
								)}
						</div>
					</div>

					{/* Account Settings */}
					<div style={{
						backgroundColor: 'white',
						borderRadius: '12px',
						padding: '24px',
						boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
					}}>
						<h3 style={{
							fontSize: '18px',
							fontWeight: '600',
							color: '#1e293b',
							marginBottom: '16px',
							display: 'flex',
							alignItems: 'center',
							gap: '8px'
						}}>
							<Award size={20} style={{ color: '#8b5cf6' }} />
							Account Information
						</h3>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '12px 0',
								borderBottom: '1px solid #e2e8f0'
							}}>
								<span style={{ color: '#374151', fontSize: '14px' }}>Member since</span>
								<span style={{ color: '#64748b', fontSize: '14px' }}>January 2024</span>
							</div>

							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '12px 0',
								borderBottom: '1px solid #e2e8f0'
							}}>
								<span style={{ color: '#374151', fontSize: '14px' }}>Account status</span>
								<span style={{
									color: '#16a34a',
									fontSize: '14px',
									fontWeight: '500'
								}}>
									Active
								</span>
							</div>

							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '12px 0'
							}}>
								<span style={{ color: '#374151', fontSize: '14px' }}>Last login</span>
								<span style={{ color: '#64748b', fontSize: '14px' }}>Today, 2:30 PM</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
