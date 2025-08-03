import JobApplication from "./JobApplication";
import Card from "./Card";
import SideBar from "../utils/SideBar";
import { useEffect,useState,useContext } from "react";
import { AuthContext } from "../context/UserContext";
export default function MainPage(){
    const { applications} = useContext(AuthContext)
    const sliced_application = applications.slice(0,5)
    const refused = applications.filter((application) => application.status == "REFUSED")
    const interview = applications.filter((application) => application.status == "INTERVIEW")
    const pending = applications.filter((application) => application.status == "PENDING")
    const applied = refused.length + interview.length + pending.length
    console.log(refused)
    console.log(pending)
    console.log(applied)
    return (
        <div class="layout">
        <SideBar > </SideBar>
      
        <div className="content-main">
            <div className="cards-main">
                <Card title={"Applied"} count={applied} icon_name={"smile"}></Card>
                <Card title={"Refused"} count={refused.length} icon_name={"frown"}></Card>
                <Card title={"Pending"} count={pending.length} icon_name={"clock"}></Card>
                <Card title={"Offers"} count={2} icon_name={"trophy"}></Card>
                <Card title={"Interviews"} count={interview.length} icon_name={"calendar-clock"}></Card>
            </div>

            <div className="applications-main">
                 <div className="application-header">
                    <div>Position</div>
                    <div>Company</div>
                    <div>Location</div>
                    <div>Type</div>
                    <div>Date</div>
                    <div>Salary</div>
                    <div></div>
                    <div>Status</div>
                </div>
                {sliced_application.map(application => {
                  return <JobApplication
                key={application.id}
                job_title={application.position}
                company_name={application.company}
                location={application.location}
                work_type={application["job_type"]}
                application_date={application["date_applied"].split('T')[0]}
                salary={`£${application.salary.toLocaleString()}` }
                application_tag={application.status}
                />  
                })}
                </div>
        </div>
        </div>
        
    );
}





// useEffect( () => {
//         async function getUser() {
//         const token = localStorage.getItem('access_token')
//         const response = await fetch("http://127.0.0.1:8000/api/v1/auth/users/me/",{
//             method: "GET",
//             headers: {"Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,}
            
//         })
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.detail || "Login failed");

//         console.log("Data success:", data);
//         setUserData(data)
//     }
//     getUser();
//     }, [])
    
    