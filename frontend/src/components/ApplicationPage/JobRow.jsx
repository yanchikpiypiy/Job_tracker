
import styles from "./ApplicationList.module.css";
import { useState } from "react";
/**
 * One table-row in the applications grid with edit/delete actions.
 *
 * Props
 * ────
 * job          { position, company, location, type, date, salary }
 * squareClass  CSS class for the coloured square (greenSq, greySq…)
 * pillClass    CSS class for the coloured status pill (pillGreen…)
 * statusText   "APPLIED" | "PENDING" | "REFUSED"
 * onEdit       Function called when edit button is clicked
 * onDelete     Function called when delete button is clicked
 */
export default function JobRow({ job, squareClass, pillClass, statusText, onEdit, onDelete, ticks }) {
  function onEdit(){
    // here we will redirect to a page or modal/ pop up -> job listing
  }
  function onDelete(){
    // here we will delete this specific job
  }

  return (
    <div className={styles.gridRow}> 
      <div>
        <span className={`${styles.square} ${ ticks[statusText] == true ? styles.greenSq : styles.transSq} `} /> 
        {/* we could use ${squareClass} here for colour */}
      </div>
      
      <div className={styles.wrap}>{job.position}</div>
      <div className={styles.wrap}>{job.company}</div>
      <div className={styles.wrap}>{job.location}</div>
      <div>{job.type}</div>
      <div>{job.date}</div>
      <div>{job.salary}</div>
      
      {/* Status comes before action buttons */}
      <div>
        <span className={`${styles.pill} ${pillClass}`}>{statusText}</span>
      </div>
      
      {/* Edit button */}
      <div>
        <button 
          className={`${styles.actionBtn} ${styles.editBtn}`}
          onClick={() => onEdit(job)}
          title="Edit application"
        >
          <img src="/edit.svg" alt="Edit" className={styles.actionIcon} />
        </button>
      </div>
      
      {/* Delete button */}
      <div>
        <button 
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={() => onDelete(job)}
          title="Delete application"
        >
          <img src="/delete.svg" alt="Delete" className={styles.actionIcon} />
        </button>
      </div>
    </div>
  );
}