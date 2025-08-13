import React from 'react';
import { Plus, Clock, MapPin, Users, X } from 'lucide-react';
import styles from './AddMeetingModal.module.css';

const AddMeetingModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  newMeeting, 
  setNewMeeting, 
  onAddMeeting, 
  meetingTypes 
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <Plus size={20} />
            Add Meeting
          </h3>
          <button
            onClick={onClose}
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
              value={newMeeting.meeting_type}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, meeting_type: e.target.value }))}
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
            onClick={onClose}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Cancel
          </button>
          <button
            onClick={onAddMeeting}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            <Plus size={16} />
            Add Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMeetingModal;