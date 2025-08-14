import React, { useContext, useState } from "react";
import styles from "./ApplicationList.module.css";
import SideBar from "../utils/SideBar";
import JobRow from "./JobRow";
import { AuthContext } from "../context/UserContext";
import { convertor } from "../utils/applicationHelpers";
import AddJobModal from "../modal/AddJobModal";
import {ApplicationsContext} from "../context/ApplicationContext";
import EditJobModal from "../modal/EditJobModal";
import { Plus } from "lucide-react";

export default function ApplicationsList() {
	const { applications } = useContext(ApplicationsContext)
	const grouped = convertor(applications)
	const [collapsed, setCollapsed] = useState(
		Object.fromEntries(grouped.map(g => [g.status, false]))
	);
	const [modalOpen, setModalOpen] = useState(false);
	
	// ticks logic
	const [ticked, setTicked] = useState(
		Object.fromEntries(grouped.map(g => [g.status, false]))
	)
	const [jobTicked, setJobTicked] = useState({});

	// Calculate stats
	const totalApplications = applications.length;
	const appliedCount = applications.filter(app => app.status === 'APPLIED').length;
	const interviewCount = applications.filter(app => app.status === 'INTERVIEW').length;
	const pendingCount = applications.filter(app => app.status === 'PENDING').length;

	// toggling all squares of the same group
	function handleStatusSquare(status){
		const newGroupTicked = !ticked[status];
		setTicked(prev => ({ ...prev, [status]: newGroupTicked }));
		
		// When group is toggled, toggle all jobs in that group
		const groupJobs = grouped.find(g => g.status === status)?.jobs || [];
		const jobUpdates = {};
		groupJobs.forEach(job => {
			jobUpdates[job.id] = newGroupTicked;
		});
		setJobTicked(prev => ({ ...prev, ...jobUpdates }));
	}

	function handleJobTickChange(status,jobId) {
		setTicked(prev => ({ ...prev, [status]: false }))
		setJobTicked(prev => ({...prev, [jobId] : !prev[jobId]}))
	}

	return (
		<div className={styles.layout}>
			<SideBar />
			<AddJobModal isOpen={modalOpen} setIsOpen={setModalOpen} />
			<div className={styles.contentMain}>
				<div className={styles.applicationMain}>

					{/* Enhanced header section with better stats positioning */}
					<div className={styles.headerSection}>
						

						{/* Option 2: Inline stats with title (uncomment to try this instead) */}
						
						<div className={styles.headerTop}>
							<div className={styles.titleWithStats}>
								<h2 className={styles.title}>
									<span role="img" aria-label="clipboard">📋</span>
									My Applications
								</h2>
								{totalApplications > 0 && (
									<div className={styles.inlineStats}>
										<div className={styles.statItem}>
											<span className={styles.statNumber}>{totalApplications}</span>

											<span>total</span>
										</div>
										<div className={styles.statItem}>
											<span className={styles.statNumber}>{appliedCount}</span>
											<span>applied</span>
										</div>
										{interviewCount > 0 && (
											<div className={styles.statItem}>
												<span className={styles.statNumber}>{interviewCount}</span>
												<span>interviews</span>
											</div>
										)}
									</div>
								)}
							</div>
							
							<button 
								className={styles.addButton} 
								onClick={() => setModalOpen(true)}
							>
								<Plus size={16} />
								Add Application
							</button>
						</div>
						
					</div>

					{grouped.map(group => (
					  <div key={group.status}>
							{/* group header */}
							<header
								className={styles.groupHeader}
								onClick={() =>
									setCollapsed(prev => ({ ...prev, [group.status]: !prev[group.status] }))
								}
							>
								<span
									className={`${styles.caret} ${
										collapsed[group.status] ? styles.caretDown : styles.caretUp
									}`}
								/>
								<span className={`${styles.badge} ${group.pill}`}>{group.status}</span>
								<span className={styles.count}>· {group.jobs.length} jobs</span>
							</header>

							{/* grid header + rows */}
							{!collapsed[group.status] && (
								<>
									<div className={`${styles.gridRow} ${styles.header}`}>
										<div onClick={() => handleStatusSquare(group.status)}>
											<span className={`${styles.square} ${ticked[group.status] == true ? styles.greenSq : styles.transSq}`} >
												{ticked[group.status] && (<img src="/check.svg" alt="Selected" className={styles.checkIcon} />)}
											</span>
										</div>
										<div>Name</div>
										<div>Company</div>
										<div>Location</div>
										<div>Type</div>
										<div>Date</div>
										<div>Salary</div>
										<div>Status</div>
									</div>

									{group.jobs.map(job => (
										<JobRow
											key={job.id}
											job={job}
											squareClass={group.square}
											pillClass={group.pill}
											statusText={group.status}
											ticks={jobTicked}
											onTickChange={handleJobTickChange}
										/>
									))}
								</>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}