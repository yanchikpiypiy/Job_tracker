import { useContext, useState } from "react";
import { AuthContext } from "../context/UserContext";
import { 
    User, 
    Bell, 
    Moon, 
    LogOut, 
    BarChart3, 
    Briefcase, 
    Calendar, 
    FileText, 
    Settings,
    ChevronDown
} from "lucide-react";

export default function SideBar(){
    const {user} = useContext(AuthContext)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <aside className="sidebar-main">
            <div className="sidebar-top">
                <div className="profile-section" style={{position: 'relative'}}>
                    <img src="public/Io_icon.png" className="profile-img" alt="Profile image"></img>
                    <div className="profile-info">
                        <span className="profile-name">{user?.username}</span>
                        <span className="profile-status">Online</span>
                    </div>
                    <div
                        className="arrow-dropdown"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: 'var(--color-sidebar-text)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px'
                        }}
                    >
                        <ChevronDown size={16} />
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-item" onClick={() => {/* Navigate to profile */}}>
                                <User className="dropdown-icon" size={16} />
                                <span>My Profile</span>
                            </div>
                            <div className="dropdown-item" onClick={() => {/* Toggle notifications */}}>
                                <Bell className="dropdown-icon" size={16} />
                                <span>Notifications</span>
                            </div>
                            <div className="dropdown-item" onClick={() => {/* Toggle theme */}}>
                                <Moon className="dropdown-icon" size={16} />
                                <span>Dark Mode</span>
                            </div>
                            <hr className="dropdown-divider" />
                            <div className="dropdown-item logout" onClick={() => {/* Logout function */}}>
                                <LogOut className="dropdown-icon" size={16} />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>

                <ul className="sidebar-links">
                    <li>
                        <a href="/dashboard" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <BarChart3 size={16} /> Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="/jobs" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Briefcase size={16} /> Job Board
                        </a>
                    </li>
                    <li>
                        <a href="/calendar" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Calendar size={16} /> Calendar
                        </a>
                    </li>
                    <li>
                        <a href="/documents" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <FileText size={16} /> Documents
                        </a>
                    </li>
                </ul>
            </div>

            <div className="sidebar-footer">
                <a href="/settings" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Settings size={16} /> Settings
                </a>
            </div>
        </aside>
    );
}