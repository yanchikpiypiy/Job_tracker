import React, { useContext, useState } from "react";
import styles from "./ApplicationList.module.css";
import SideBar from "../utils/SideBar";
import JobRow from "./JobRow";
import { AuthContext } from "../context/UserContext";
import { convertor } from "../utils/applicationHelpers";
import AddJobModal from "../modal/AddJobModal";
import EditJobModal from "../modal/EditJobModal";
/* ─── grouped mock data (unchanged) ───────────────────────────────── */
// example of an object returned by convertor function
const mockGroups = [
	{
		status: "APPLIED",
		square: styles.greenSq,
		pill: styles.pillGreen,
		jobs: [
			{
				id: 1,
				position: "Frontend Developer",
				company: "Google",
				location: "Remote (US)",
				type: "Full-Time",
				date: "2024-06-28",
				salary: "$135 k",
			},
		],
	}
]

/* ─────────────────────────────────────────────────────────────────── */

export default function ApplicationsList() {
	const { applications } = useContext(AuthContext)
	const grouped = convertor(applications)
	const [collapsed, setCollapsed] = useState(
		Object.fromEntries(grouped.map(g => [g.status, false]))
	);
	// ticks logic
	const [ticked, setTicked] = useState(
		Object.fromEntries(grouped.map(g => [g.status, false]))
	)
	const [jobTicked, setJobTicked] = useState({});

	// toggling all squares os the same group
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
			<AddJobModal></AddJobModal>
			<div className={styles.contentMain}>
				<div className={styles.applicationMain}>

					<h2 className={styles.title}>
						<span role="img" aria-label="clipboard">📋</span>
						My Applications
					</h2>

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