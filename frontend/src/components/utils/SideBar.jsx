
export default function SideBar({userdata}){

    return (
        <aside className="sidebar-main">
            <div className="sidebar-top">
                <div className="profile-section">
                <img src="public/Io_icon.png" className="profile-img" alt="Profile image"></img>
                <div className="profile-info">
                    <span className="profile-name">{userdata.username}</span>
                    <span className="profile-status">Online</span>
                    
                </div>
                <img src="public/down-arrow.png" alt="Arrow Icon" className="arrow-icon"></img>
                </div>

                <ul className="sidebar-links">
                <li><a href="/dashboard">📊 Dashboard</a></li>
                <li><a href="/jobs">💼 Job Board</a></li>
                <li><a href="/teams">👥 Teams</a></li>
                <li><a href="/calendar">🗓️ Calendar</a></li>
                </ul>

                <div className="sidebar-section">
                <div className="section-header">
                    <span>My Applications</span>
                    <button className="add-btn">+ Add</button>
                </div>
                <ul className="project-links">
                    <li><span className="dot purple"></span> Amazon</li>
                    <li><span className="dot green"></span> Google</li>
                    <li><span className="dot blue"></span> Meta</li>
                </ul>
                </div>
            </div>

            <div className="sidebar-footer">
                <a href="/settings">⚙️ Settings</a>
            </div>
        </aside>
    );
}