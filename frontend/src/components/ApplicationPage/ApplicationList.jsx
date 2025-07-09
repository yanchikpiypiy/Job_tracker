import React, { useState } from "react";
import styles from "./ApplicationList.module.css";
import SideBar from "../utils/SideBar";

/* ─── demo data grouped by status ─────────────────────────────────── */
const mockGroups = [
  {
    status: "APPLIED",
    square: styles.greenSq,
    pill:   styles.pillGreen,
    jobs: [
      {
        id: 1,
        position: "Frontend Developer",
        company:  "Google",
        location: "Remote (US)",
        type:     "Full-Time",
        date:     "2024-06-28",
        salary:   "$135 k",
      },
    ],
  },
  {
    status: "PENDING",
    square: styles.greySq,
    pill:   styles.pillGrey,
    jobs: [
      {
        id: 2,
        position: "Backend Engineer",
        company:  "Amazon",
        location: "Seattle, WA",
        type:     "Full-Time",
        date:     "2024-07-01",
        salary:   "$150 k",
      },
    ],
  },
  {
    status: "REFUSED",
    square: styles.redSq,
    pill:   styles.pillRed,
    jobs: [
      {
        id: 3,
        position: "QA Specialist",
        company:  "Meta",
        location: "Menlo Park, CA",
        type:     "Contract",
        date:     "2024-07-05",
        salary:   "$60 hr",
      },
    ],
  },
];
/* ─────────────────────────────────────────────────────────────────── */

export default function ApplicationsList() {
  const [collapsed, setCollapsed] = useState(
    Object.fromEntries(mockGroups.map(g => [g.status, false]))
  );

  return (
    <div className={styles.layout}>
      <SideBar />

      <div className={styles.contentMain}>
        <div className={styles.applicationMain}>

          <h2 className={styles.title}>
            <span role="img" aria-label="clipboard">📋</span>
            My Applications
          </h2>

          {mockGroups.map(group => (
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
                <span className={styles.badge}>{group.status}</span>
                <span className={styles.count}>· {group.jobs.length} jobs</span>
              </header>

              {!collapsed[group.status] && (
                <>
                  {/* column labels */}
                  <div className={`${styles.gridRow} ${styles.header}`}>
                    <div />
                    <div>Name</div>
                    <div>Company</div>
                    <div>Location</div>
                    <div>Type</div>
                    <div>Date</div>
                    <div>Salary</div>
                    <div />
                    <div>Status</div>
                  </div>

                  {/* rows */}
                  {group.jobs.map(job => (
                    <div key={job.id} className={styles.gridRow}>
                      <div><span className={`${styles.square} ${group.square}`} /></div>
                      <div className={styles.wrap}>{job.position}</div>
                      <div className={styles.wrap}>{job.company}</div>
                      <div className={styles.wrap}>{job.location}</div>
                      <div>{job.type}</div>
                      <div className={styles.right}>{job.date}</div>
                      <div className={styles.right}>{job.salary}</div>
                      <div />
                      <div>
                        <span className={`${styles.pill} ${group.pill}`}>{group.status}</span>
                      </div>
                    </div>
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
