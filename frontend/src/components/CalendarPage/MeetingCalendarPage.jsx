import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, X, Calendar } from 'lucide-react';
import styles from './MeetingCalendar.module.css';
import SideBar from '../utils/SideBar';


/* meeting object {
  "2025-08-03": [
    { "id": 1, "title": "Team Sync", "time": "10:00 AM", "type": "internal" }
  ],
  ...
}
*/

const MeetingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetings, setMeetings] = useState({});
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: '',
    location: '',
    attendees: '',
    type: 'interview',
    notes: ''
  });
  console.log(meetings)
  console.log(currentDate)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const meetingTypes = {
    'interview': { cssClass: styles.meetingInterview, label: 'Interview' },
    'networking': { cssClass: styles.meetingNetworking, label: 'Networking' },
    'followup': { cssClass: styles.meetingFollowup, label: 'Follow-up' },
    'assessment': { cssClass: styles.meetingAssessment, label: 'Assessment' },
    'other': { cssClass: styles.meetingOther, label: 'Other' }
  };

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days to fill the calendar
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
  const daysFromPrevMonth = firstDayWeekday;

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      console.log(`${newDate} new data`)
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleDateClick = (day, isCurrentMonth = true) => {
    if (!isCurrentMonth) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowAddMeeting(true);
  };

  const handleAddMeeting = () => {
    if (!selectedDate || !newMeeting.title || !newMeeting.time) {
      alert('Please fill in at least the meeting title and time');
      return;
    }

    const dateKey = formatDateKey(selectedDate);
    const meetingWithId = {
      ...newMeeting,
      id: Date.now(),
      date: selectedDate
    };

    setMeetings(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), meetingWithId]
    }));

    // Reset form
    setNewMeeting({
      title: '',
      time: '',
      location: '',
      attendees: '',
      type: 'interview',
      notes: ''
    });
    setShowAddMeeting(false);
    setSelectedDate(null);
  };

  const deleteMeeting = (dateKey, meetingId) => {
    setMeetings(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(meeting => meeting.id !== meetingId)
    }));
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const todayKey = formatDateKey(today);

    // Previous month days (grayed out)
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const day = prevMonth.getDate() - i + 1;
      days.push(
        <div key={`prev-${day}`} className={`${styles.dayCell} ${styles.dayCellInactive}`}>
          <div className={styles.dayHeader}>
            <span className={`${styles.dayNumber} ${styles.dayNumberInactive}`}>{day}</span>
          </div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const dayMeetings = meetings[dateKey] || [];
      const isToday = dateKey === todayKey;
      const isPast = date < today && !isToday;

      let cellClasses = [styles.dayCell];
      let numberClasses = [styles.dayNumber];

      if (isToday) {
        cellClasses.push(styles.dayCellToday);
        numberClasses.push(styles.dayNumberToday);
      } else if (isPast) {
        cellClasses.push(styles.dayCellPast);
        numberClasses.push(styles.dayNumberPast);
      }

      if (dayMeetings.length > 0) {
        cellClasses.push(styles.dayCellWithMeetings);
      }

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={cellClasses.join(' ')}
        >
          <div className={styles.dayHeader}>
            <span className={numberClasses.join(' ')}>{day}</span>
            {dayMeetings.length > 0 && (
              <span className={styles.meetingCount}>{dayMeetings.length}</span>
            )}
          </div>
          
          <div className={styles.meetingsContainer}>
            {dayMeetings.slice(0, 2).map(meeting => (
              <div
                key={meeting.id}
                className={`${styles.meetingItem} ${meetingTypes[meeting.type].cssClass}`}
                title={`${meeting.title} at ${meeting.time}`}
              >
                {meeting.time} - {meeting.title}
              </div>
            ))}
            {dayMeetings.length > 2 && (
              <div className={styles.meetingMore}>+{dayMeetings.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    // Next month days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 cells
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className={`${styles.dayCell} ${styles.dayCellInactive}`}>
          <div className={styles.dayHeader}>
            <span className={`${styles.dayNumber} ${styles.dayNumberInactive}`}>{day}</span>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendarWrapper}>
        <SideBar></SideBar>
        <div className={styles.calendarContainer}>
                
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                <Calendar className={styles.calendarIcon} />
                <h1 className={styles.mainTitle}>Meeting Calendar</h1>
                </div>
                
                <div className={styles.navigation}>
                <button onClick={() => navigateMonth(-1)} className={styles.navButton}>
                    <ChevronLeft size={20} color='Black' />
                </button>
                
                <h2 className={styles.monthTitle}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <button onClick={() => navigateMonth(1)} className={styles.navButton}>
                    <ChevronRight size={20} color='Black' />
                </button>
                </div>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <span className={styles.legendLabel}>Meeting Types:</span>
                {Object.entries(meetingTypes).map(([type, config]) => (
                <div key={type} className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${config.cssClass}`}></div>
                    <span className={styles.legendText}>{config.label}</span>
                </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className={styles.calendarGrid}>
                {/* Day headers */}
                <div className={styles.dayHeaders}>
                {dayNames.map(day => (
                    <div key={day} className={styles.dayHeader}>
                    {day}
                    </div>
                ))}
                </div>
                
                {/* Calendar days */}
                <div className={styles.calendarDays}>
                {renderCalendarDays()}
                </div>
            </div>

            {/* Add Meeting Modal */}
            {showAddMeeting && (
                <div className={styles.modalBackdrop} onClick={() => {
                setShowAddMeeting(false);
                setSelectedDate(null);
                }}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        <Plus size={20} />
                        Add Meeting
                    </h3>
                    <button
                        onClick={() => {
                        setShowAddMeeting(false);
                        setSelectedDate(null);
                        }}
                        className={styles.modalCloseButton}
                    >
                        <X size={20} />
                    </button>
                    </div>

                    {selectedDate && (
                    <p className={styles.modalDate}>
                        {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                        })}
                    </p>
                    )}

                    <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Meeting Title *</label>
                    <input
                        type="text"
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                        className={styles.formInput}
                        placeholder="e.g., Interview with Google"
                    />
                    </div>

                    <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                        <span className={styles.iconLabel}>
                            <Clock size={16} />
                            Time *
                        </span>
                        </label>
                        <input
                        type="time"
                        value={newMeeting.time}
                        onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                        className={styles.formInput}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Type</label>
                        <select
                        value={newMeeting.type}
                        onChange={(e) => setNewMeeting(prev => ({ ...prev, type: e.target.value }))}
                        className={styles.formSelect}
                        >
                        {Object.entries(meetingTypes).map(([type, config]) => (
                            <option key={type} value={type}>{config.label}</option>
                        ))}
                        </select>
                    </div>
                    </div>

                    <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        <span className={styles.iconLabel}>
                        <MapPin size={16} />
                        Location
                        </span>
                    </label>
                    <input
                        type="text"
                        value={newMeeting.location}
                        onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                        className={styles.formInput}
                        placeholder="e.g., Google Office, Zoom, Phone"
                    />
                    </div>

                    <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        <span className={styles.iconLabel}>
                        <Users size={16} />
                        Attendees
                        </span>
                    </label>
                    <input
                        type="text"
                        value={newMeeting.attendees}
                        onChange={(e) => setNewMeeting(prev => ({ ...prev, attendees: e.target.value }))}
                        className={styles.formInput}
                        placeholder="e.g., John Smith, Sarah Johnson"
                    />
                    </div>

                    <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Notes</label>
                    <textarea
                        value={newMeeting.notes}
                        onChange={(e) => setNewMeeting(prev => ({ ...prev, notes: e.target.value }))}
                        className={styles.formTextarea}
                        placeholder="Additional notes or preparation items..."
                    />
                    </div>

                    <div className={styles.buttonContainer}>
                    <button
                        onClick={() => {
                        setShowAddMeeting(false);
                        setSelectedDate(null);
                        }}
                        className={`${styles.button} ${styles.buttonSecondary}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddMeeting}
                        className={`${styles.button} ${styles.buttonPrimary}`}
                    >
                        <Plus size={16} />
                        Add Meeting
                    </button>
                    </div>
                </div>
                </div>
            )}

            {/* Today's Meetings Section */}
            <div className={styles.todaySection}>
                <h3 className={styles.todaySectionTitle}>Today's Meetings</h3>
                {(() => {
                const today = new Date();
                const todayKey = formatDateKey(today);
                const todayMeetings = meetings[todayKey] || [];
                
                if (todayMeetings.length === 0) {
                    return <p className={styles.noMeetings}>No meetings scheduled for today</p>;
                }
                
                return (
                    <div className={styles.todayMeetings}>
                    {todayMeetings.map(meeting => (
                        <div key={meeting.id} className={styles.todayMeetingItem}>
                        <div className={styles.todayMeetingContent}>
                            <h4 className={styles.todayMeetingTitle}>{meeting.title}</h4>
                            <div className={styles.todayMeetingDetails}>
                            <span className={styles.todayMeetingDetail}>
                                <Clock size={14} />
                                {meeting.time}
                            </span>
                            {meeting.location && (
                                <span className={styles.todayMeetingDetail}>
                                <MapPin size={14} />
                                {meeting.location}
                                </span>
                            )}
                            </div>
                            <span className={`${styles.todayMeetingType} ${meetingTypes[meeting.type].cssClass}`}>
                            {meetingTypes[meeting.type].label}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteMeeting(todayKey, meeting.id)}
                            className={styles.deleteButton}
                        >
                            <X size={16} />
                        </button>
                        </div>
                    ))}
                    </div>
                );
                })()}
            </div>
            </div>
    </div>
    
  );
};

export default MeetingCalendar;