
import styles from "./ApplicationList.module.css";
import { useState, useContext } from "react";
import { AuthContext } from "../context/UserContext";
import EditJobModal from "../modal/EditJobModal";
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
export default function JobRow({ job, squareClass, pillClass, statusText, ticks,onTickChange }) {
  const {deleteUserApplication} = useContext(AuthContext)
  // editing modal logic
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  // delete confirmation modal logic
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const handleEditClick = (application) => {
		setEditingApplication(application);
		setIsEditModalOpen(true);
  	};

	 const handleCloseEditModal = () => {
    	setIsEditModalOpen(false);
    	setEditingApplication(null);
  	};
	
  // prompt pop up 

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteUserApplication(job.id);
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  function handlePick(){
    onTickChange(statusText,job.id)
  }
  return (
    <div className={styles.gridRow}> 
      <div onClick={() => handlePick()}>
        <span className={`${styles.square} ${ ticks[job.id] ? styles.greenSq : styles.transSq} `}>
          {ticks[job.id] && (<img src="/check.svg" alt="Selected" className={styles.checkIcon} />)}
        </span>
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
          onClick={() => handleEditClick(job)}
          title="Edit application"
        >
          <img src="/edit.svg" alt="Edit" className={styles.actionIcon} />
        </button>
      </div>
      
      {/* Delete button */}
      <div>
        <button 
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={handleDeleteClick}
          title="Delete application"
        >
          <img src="/delete.svg" alt="Delete" className={styles.actionIcon} />
        </button>
      </div>
      <EditJobModal
      application={editingApplication}
      isOpen={isEditModalOpen}
      onClose={handleCloseEditModal}
    />
    {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalBackdrop} onClick={handleCancelDelete}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Confirm Delete</h3>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete the application for:</p>
              <p><strong>{job.position}</strong> at <strong>{job.company}</strong>?</p>
              <p style={{ color: '#c33', fontSize: '0.9em' }}>This action cannot be undone.</p>
            </div>
            <div className={styles.buttonContainer}>
              <button 
                onClick={handleCancelDelete}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className={`${styles.button} ${styles.buttonDanger}`}
                style={{ backgroundColor: '#dc3545', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
    )}
    </div>
  );
}