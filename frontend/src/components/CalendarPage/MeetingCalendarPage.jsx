import React, { useContext, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, X } from 'lucide-react';
import styles from './MeetingCalendar.module.css';
import SideBar from '../utils/SideBar';
import AddMeetingModal from '../modal/AddMeetingModal';
import { transformMeetingForBackend } from '../utils/meetingHelpers';
import { MeetingsContext } from '../context/MeetingContext';

const MeetingCalendar = () => {
  const {meetings, addMeeting, deleteMeeting} = useContext(MeetingsContext); // Add deleteMeeting from context
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showDayMeetings, setShowDayMeetings] = useState(false); // New state for showing day meetings
  const [selectedDayMeetings, setSelectedDayMeetings] = useState([]); // New state for selected day meetings
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: '',
    location: '',
    attendees: '',
    meeting_type: 'interview',
    notes: ''
  });
  
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

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
  const daysFromPrevMonth = firstDayWeekday;

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
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
    const dateKey = formatDateKey(clickedDate);
    const dayMeetings = meetings[dateKey] || [];
    
    setSelectedDate(clickedDate);
    
    // If there are existing meetings, show them for management, otherwise show add meeting modal
    if (dayMeetings.length > 0) {
      setSelectedDayMeetings(dayMeetings);
      setShowDayMeetings(true);
    } else {
      setShowAddMeeting(true);
    }
  };

  const handleAddMeeting = () => {
    if (!selectedDate || !newMeeting.title || !newMeeting.time) {
      alert('Please fill in at least the meeting title and time');
      return;
    }

    const dateKey = formatDateKey(selectedDate);
    
    const value = transformMeetingForBackend(newMeeting, dateKey);
    addMeeting(value);

    // Reset form
    setNewMeeting({
      title: '',
      time: '',
      location: '',
      attendees: '',
      meeting_type: 'interview',
      notes: ''
    });
    setShowAddMeeting(false);
    setSelectedDate(null);
  };

  const handleCloseModal = () => {
    setShowAddMeeting(false);
    setShowDayMeetings(false);
    setSelectedDate(null);
    setSelectedDayMeetings([]);
    // Reset form when closing
    setNewMeeting({
      title: '',
      time: '',
      location: '',
      attendees: '',
      meeting_type: 'interview',
      notes: ''
    });
  };

  const handleDeleteMeeting = (dateKey, meetingId) => {
    deleteMeeting(dateKey, meetingId); // Use context function
    // Update the selected day meetings if viewing that day
    if (selectedDate && formatDateKey(selectedDate) === dateKey) {
      const updatedMeetings = selectedDayMeetings.filter(meeting => meeting.id !== meetingId);
      setSelectedDayMeetings(updatedMeetings);
      // Close modal if no more meetings
      if (updatedMeetings.length === 0) {
        setShowDayMeetings(false);
      }
    }
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
                className={`${styles.meetingItem} ${meetingTypes[meeting.meeting_type].cssClass}`}
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
    const remainingCells = 42 - days.length;
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
      <SideBar />
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
        <AddMeetingModal
          isOpen={showAddMeeting}
          onClose={handleCloseModal}
          selectedDate={selectedDate}
          newMeeting={newMeeting}
          setNewMeeting={setNewMeeting}
          onAddMeeting={handleAddMeeting}
          meetingTypes={meetingTypes}
        />

        {/* Day Meetings Modal for viewing/deleting meetings */}
        {showDayMeetings && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>Meetings for {selectedDate?.toLocaleDateString()}</h3>
                <button onClick={handleCloseModal} className={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalContent}>
                {selectedDayMeetings.map(meeting => (
                  <div key={meeting.id} className={styles.meetingItemDetailed}>
                    <div className={styles.meetingInfo}>
                      <h4>{meeting.title}</h4>
                      <div className={styles.meetingDetails}>
                        <span><Clock size={14} /> {meeting.time}</span>
                        {meeting.location && <span><MapPin size={14} /> {meeting.location}</span>}
                        <span className={`${styles.meetingType} ${meetingTypes[meeting.meeting_type].cssClass}`}>
                          {meetingTypes[meeting.meeting_type].label}
                        </span>
                      </div>
                      {meeting.attendees && <p>Attendees: {meeting.attendees}</p>}
                      {meeting.notes && <p>Notes: {meeting.notes}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteMeeting(formatDateKey(selectedDate), meeting.id)}
                      className={styles.deleteButton}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className={styles.modalActions}>
                  <button 
                    onClick={() => {
                      setShowDayMeetings(false);
                      setShowAddMeeting(true);
                    }}
                    className={styles.addMoreButton}
                  >
                    Add Another Meeting
                  </button>
                </div>
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
                      <span className={`${styles.todayMeetingType} ${meetingTypes[meeting.meeting_type].cssClass}`}>
                        {meetingTypes[meeting.meeting_type].label}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteMeeting(todayKey, meeting.id)}
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