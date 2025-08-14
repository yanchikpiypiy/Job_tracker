import styles from "./ApplicationList.module.css";
import { useState, useContext } from "react";
import EditJobModal from "../modal/EditJobModal";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { ApplicationsContext } from "../context/ApplicationContext";

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
export default function JobRow({ job, squareClass, pillClass, statusText, ticks, onTickChange }) {
  const { deleteUserApplication } = useContext(ApplicationsContext);
  
  // editing modal logic
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  
  // delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClick = (application) => {
    setEditingApplication(application);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingApplication(null);
  };

  // Start delete confirmation flow
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    deleteUserApplication(job.id);
    setShowDeleteConfirm(false);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  function handlePick() {
    onTickChange(statusText, job.id);
  }

  return (
    <div className={styles.gridRow}> 
      <div onClick={() => handlePick()}>
        <span className={`${styles.square} ${ticks[job.id] ? styles.greenSq : styles.transSq}`}>
          {ticks[job.id] && (<img src="/check.svg" alt="Selected" className={styles.checkIcon} />)}
        </span>
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
          onClick={() => handleEditClick(job)}
          title="Edit application"
        >
          <Edit2 size={16} color="Black" className={styles.actionIcon} />
        </button>
      </div>
      
      {/* Delete button or confirmation buttons */}
      <div className={styles.deleteButtonContainer}>
        {!showDeleteConfirm ? (
          // Normal delete button
          <button 
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={handleDeleteClick}
            title="Delete application"
          >
            <Trash2 size={16} color="Black" className={styles.actionIcon} />
          </button>
        ) : (
          // Confirmation buttons
          <div className={styles.confirmButtons}>
            <button 
              className={`${styles.doubleCheckBtn} ${styles.confirmBtn}`}
              onClick={handleConfirmDelete}
              title="Confirm delete"
            >
              <Check size={16} color="Black" className={styles.actionIcon} />
            </button>
            <button 
              className={`${styles.doubleCheckBtn} ${styles.cancelBtn}`}
              onClick={handleCancelDelete}
              title="Cancel delete"
            >
              <X size={16} color="Black" className={styles.actionIcon} />
            </button>
          </div>
        )}
      </div>
      
      <EditJobModal
        application={editingApplication}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
    </div>
  );
}