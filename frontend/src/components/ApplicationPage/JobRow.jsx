import React from "react";
import styles from "./ApplicationList.module.css";   // reuse same CSS

/**
 * One table-row in the applications grid.
 *
 * Props
 * ────
 * job          { position, company, location, type, date, salary }
 * squareClass  CSS class for the coloured square (greenSq, greySq…)
 * pillClass    CSS class for the coloured status pill  (pillGreen…)
 * statusText   "APPLIED" | "PENDING" | "REFUSED"
 */
export default function JobRow({ job, squareClass, pillClass, statusText }) {
  return (
    <div className={styles.gridRow}>
      <div>
        <span className={`${styles.square} ${squareClass}`} />
      </div>

      <div className={styles.wrap}>{job.position}</div>
      <div className={styles.wrap}>{job.company}</div>
      <div className={styles.wrap}>{job.location}</div>
      <div>{job.type}</div>
      <div>{job.date}</div>
      <div>{job.salary}</div>
      <div />{/* spacer for future actions */}
      <div>
        <span className={`${styles.pill} ${pillClass}`}>{statusText}</span>
      </div>
    </div>
  );
}
