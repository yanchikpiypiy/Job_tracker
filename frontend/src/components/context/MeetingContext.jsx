// contexts/MeetingsContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { meetingsApi } from "./api";
import { AuthContext } from "./UserContext";

export const MeetingsContext = createContext();

export const useMeetings = () => useContext(MeetingsContext);

export function MeetingsProvider({ children }) {
  const {authToken} = useContext(AuthContext)
  const [meetings, setMeetings] = useState([]);
  
  // Meeting CRUD operations here

  // GET
  useEffect( () => {
    
    const getMeetings =  async () => {
        try{
            const response = await meetingsApi.getUserMeetings();
            console.log("meetings", response.data)
            setMeetings(response.data)
        }catch(error){
            console.error("Error deleting application:", error);
            setError(error.message);
        }
      }
      getMeetings()
  }, [authToken])

  // ADD
  const addMeeting =  async (data) => {
    try{
        const response = await meetingsApi.addUserMeeting(data);
        console.log("added meetings", response.data)
        const newMeeting = response.data;
        const meetingDate = newMeeting.date; // assuming the meeting has a date field
        
        setMeetings(prev => {
          // Create a new object to trigger re-render
          const updatedMeetings = { ...prev };
          
          // If this date already exists, add to the existing array
          if (updatedMeetings[meetingDate]) {
            updatedMeetings[meetingDate] = [...updatedMeetings[meetingDate], newMeeting];
          } else {
            // If this date doesn't exist, create new array with this meeting
            updatedMeetings[meetingDate] = [newMeeting];
          }
          
          return updatedMeetings;
        });
    }catch(error){
        console.error("Error deleting application:", error);
        setError(error.message);
    }
  }

  // Delete
  const deleteMeeting = async (dataKey,id) => {
    try {
      const response = await meetingsApi.deleteUserMeeting(id)
      console.log("deleted", response.data)
      setMeetings( prev =>  ({
        ...prev,
        [dataKey] : prev[dataKey] ? prev[dataKey].filter(meeting => meeting.id !== id) : []
      }))

    }catch(error){
      console.log("error", error)
      setError(error.message)
    }
  }
  return (
    <MeetingsContext.Provider value={{
      meetings,
      addMeeting,
      deleteMeeting,
    }}>
      {children}
    </MeetingsContext.Provider>
  );
}