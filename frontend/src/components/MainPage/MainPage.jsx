import JobApplication from "./JobApplication";
import Card from "./Card";
import SideBar from "../utils/SideBar";
import { useEffect,useState,useContext } from "react";
import { AuthContext } from "../context/UserContext";
export default function MainPage(){

    return (
        <div class="layout">
        <SideBar > </SideBar>
      
        <div className="content-main">
            <div className="cards-main">
                <Card title={"Applied"} count={64} icon_name={"smile"}></Card>
                <Card title={"Refused"} count={50} icon_name={"frown"}></Card>
                <Card title={"Pending"} count={6} icon_name={"clock"}></Card>
                <Card title={"Offers"} count={2} icon_name={"trophy"}></Card>
                <Card title={"Interviews"} count={10} icon_name={"calendar-clock"}></Card>
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
                <JobApplication
                job_title="Software Engineer"
                company_name="Amazon"
                location="London, B297DQ"
                work_type="Remote"
                application_date="07/07/2004"
                salary="40,000"
                application_tag="Applied"
                />
                
                <JobApplication
                job_title="Senior Software Engineer"
                company_name="Meta"
                location="London, B297DQ"
                work_type="On-site"
                application_date="07/07/2004"
                salary="540,000"
                application_tag="Applied"
                />
                
                

                <JobApplication
                job_title="Software Engineer"
                company_name="Amazon"
                location="London, B297DQ"
                work_type="Remote"
                application_date="07/07/2004"
                salary="40,000"
                application_tag="Applied"
                />

                <JobApplication
                job_title="Software Engineer"
                company_name="Amazon"
                location="London, B297DQ"
                work_type="Remote"
                application_date="07/07/2004"
                salary="40,000"
                application_tag="Applied"
                />
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
    
    