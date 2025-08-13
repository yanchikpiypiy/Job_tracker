export const transformMeetingForBackend = (frontendMeeting, selectedDate) => {
  return {
    title: frontendMeeting.title,
    time: frontendMeeting.time,
    location: frontendMeeting.location || '',
    attendees: frontendMeeting.attendees || '',
    meeting_type: frontendMeeting.meeting_type || 'interview', // Use meeting_type directly
    notes: frontendMeeting.notes || '',
    date: selectedDate // The date from your calendar selection
  };
};
