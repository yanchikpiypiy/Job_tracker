import React, { useContext, useState } from 'react';
import { Plus, X, Building, MapPin, DollarSign, Calendar, Briefcase, FileText } from 'lucide-react';

import styles from './AddJobModal.module.css';
import { ApplicationsContext } from '../context/ApplicationContext';

const AddJobModal = ({ applications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createUserApplication } = useContext(ApplicationsContext);
  
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    job_type: 'REMOTE',
    salary: '',
    status: 'APPLIED',
    date_applied: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.position.trim()) {
      setError('Position is required');
      return false;
    }
    if (!formData.company.trim()) {
      setError('Company is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (formData.salary && isNaN(parseInt(formData.salary))) {
      setError('Salary must be a valid number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const applicationData = {
        ...formData,
        // Only include salary if it's provided and valid
        salary: formData.salary ? parseInt(formData.salary) : null,
        // Ensure strings are trimmed
        position: formData.position.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
      };
      
      console.log('Sending application data:', applicationData);
      
      const result = await createUserApplication(applicationData);
      console.log('Application created successfully:', result);
      
      
      // Reset form and close modal
      setFormData({
        position: '',
        company: '',
        location: '',
        job_type: 'REMOTE',
        salary: '',
        status: 'APPLIED',
        date_applied: new Date().toISOString().split('T')[0]
      });
      setIsOpen(false);
      alert('Application added successfully!');
      
    } catch (error) {
      console.error('Error creating application:', error);
      
      // Try to extract meaningful error message
      let errorMessage = 'Failed to add application. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={styles.fabButton}
        title="Add New Application"
      >
        <Plus size={24} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Briefcase size={20} className={styles.modalTitleIcon} />
                Add New Application
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className={styles.modalCloseButton}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              
              {/* Error Message */}
              {error && (
                <div className={styles.errorMessage} style={{
                  background: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '4px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#c33'
                }}>
                  {error}
                </div>
              )}
              
              {/* Position */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Position *</label>
                <div className={styles.inputWrapper}>
                  <FileText size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${styles.withIcon}`}
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
              </div>

              {/* Company */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Company *</label>
                <div className={styles.inputWrapper}>
                  <Building size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${styles.withIcon}`}
                    placeholder="e.g., Google"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location *</label>
                <div className={styles.inputWrapper}>
                  <MapPin size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${styles.withIcon}`}
                    placeholder="e.g., London, UK"
                    required
                  />
                </div>
              </div>

              {/* Job Type and Salary Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Type</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">On-site</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Salary (£)</label>
                  <div className={styles.inputWrapper}>
                    <DollarSign size={16} className={styles.inputIcon} />
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${styles.withIcon}`}
                      placeholder="50000"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Date Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="PENDING">Pending</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="REFUSED">Refused</option>
                    <option value="OFFER">Offer</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date Applied</label>
                  <div className={styles.inputWrapper}>
                    <Calendar size={16} className={styles.inputIcon} />
                    <input
                      type="date"
                      name="date_applied"
                      value={formData.date_applied}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${styles.withIcon}`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.loadingSpinner}></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Application
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddJobModal;