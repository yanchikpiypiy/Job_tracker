import JobApplication from "./JobApplication";
import Card from "./Card";
import SideBar from "../utils/SideBar";
export default function MainPage(){
    return (
        <div class="layout">
        <SideBar> </SideBar>
      
        <div className="content-main">
            <div className="cards-main">
                <Card title={"Applied"} count={32} icon_name={"smile"}></Card>
                <Card title={"Refused"} count={32} icon_name={"frown"}></Card>
                <Card title={"Pending"} count={32} icon_name={"clock"}></Card>
                <Card title={"Offers"} count={32} icon_name={"trophy"}></Card>
                <Card title={"Interviews"} count={32} icon_name={"calendar-clock"}></Card>
            </div>

            <div className="applications-main">
                 <div class="application-header">
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