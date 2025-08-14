import JobApplication from "./JobApplication";
import Card from "./Card";
import SideBar from "../utils/SideBar";
import AddJobModal from "../modal/AddJobModal";
import EditJobModal from "../modal/EditJobModal";
import { useEffect, useState, useContext } from "react";
import { ApplicationsContext } from "../context/ApplicationContext";

export default function MainPage() {
    const { applications } = useContext(ApplicationsContext);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const sliced_application = applications.slice(0, 5);
    const refused = applications.filter((application) => application.status === "REFUSED");
    const interview = applications.filter((application) => application.status === "INTERVIEW");
    const pending = applications.filter((application) => application.status === "PENDING");
    const applied = refused.length + interview.length + pending.length;
    
    const offers = applications.filter((application) => application.status === "OFFER");

    // Handle opening edit modal for a specific application
    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setIsEditModalOpen(true);
    };

    // Handle closing edit modal
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedApplication(null);
    };

    // Handle opening add modal from existing "+ Add Offer" button
    const handleAddOffer = () => {
        setIsAddModalOpen(true);
    };

    // Make handleAddOffer available globally so your existing Card component can access it
    useEffect(() => {
        window.handleAddOffer = handleAddOffer;
        
        // Cleanup
        return () => {
            delete window.handleAddOffer;
        };
    }, []);

    return (
        <div className="layout">
            <SideBar />
      
            <div className="content-main">
                <div className="cards-main">
                    <Card title={"Applied"} count={applied} icon_name={"smile"} />
                    <Card title={"Refused"} count={refused.length} icon_name={"frown"} />
                    <Card title={"Pending"} count={pending.length} icon_name={"clock"} />
                    <Card 
                        title={"Offers"} 
                        count={offers.length} 
                        icon_name={"trophy"}
                        onAddOffer={handleAddOffer} // Pass the handler as prop if your Card component supports it
                    />
                    <Card title={"Interviews"} count={interview.length} icon_name={"calendar-clock"} />
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

                    {/* Applications List */}
                    {sliced_application.map(application => (
                        <JobApplication
                            key={application.id}
                            job_title={application.position}
                            company_name={application.company}
                            location={application.location}
                            work_type={application.job_type}
                            application_date={application.date_applied.split('T')[0]}
                            salary={`£${application.salary ? application.salary.toLocaleString() : '0'}`}
                            application_tag={application.status}
                            onView={() => handleViewApplication(application)}
                        />  
                    ))}
                </div>
            </div>

            {/* Add Job Modal */}
            <AddJobModal 
                isOpen={isAddModalOpen} 
                setIsOpen={setIsAddModalOpen} 
            />

            {/* Edit Job Modal */}
            <EditJobModal 
                application={selectedApplication}
                isOpen={isEditModalOpen} 
                onClose={handleCloseEditModal} 
            />
        </div>
    );
}