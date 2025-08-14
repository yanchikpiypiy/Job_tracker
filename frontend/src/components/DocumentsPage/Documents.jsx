    
import { useState, useEffect } from 'react';
import { 
    FileText, 
    FilePenLine, 
    Palette, 
    Award, 
    Paperclip,
    Download,
    Trash2,
    Eye,
    Plus,
    X,
    Upload,
    CloudUpload
} from 'lucide-react';
import styles from './Documents.module.css';
import SideBar from '../utils/SideBar';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [documentType, setDocumentType] = useState('resume');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);

    // Mock data for demo - replace with API call
    useEffect(() => {
        setDocuments([
            {
                id: 1,
                name: 'John_Doe_Resume_2024.pdf',
                document_type: 'resume',
                created_at: '2025-08-10T10:30:00Z',
                file: '/documents/resume.pdf'
            },
            {
                id: 2,
                name: 'Cover_Letter_Google.pdf',
                document_type: 'cover_letter',
                created_at: '2025-08-08T14:20:00Z',
                file: '/documents/cover_letter.pdf'
            },
            {
                id: 3,
                name: 'React_Certificate.pdf',
                document_type: 'certificate',
                created_at: '2025-07-15T09:45:00Z',
                file: '/documents/certificate.pdf'
            }
        ]);
    }, []);

    // File selection handlers
    const handleFileSelect = (file) => {
        setSelectedFile(file);
        if (!documentName) {
            // Auto-fill document name from filename (without extension)
            const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            setDocumentName(nameWithoutExtension);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setDocumentName('');
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    // File upload with progress simulation
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !documentName) return;

        setLoading(true);
        setUploadProgress(0);
        
        // Simulate upload with progress - replace with actual API call
        const simulateUpload = () => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Create new document
                    const newDocument = {
                        id: Date.now(),
                        name: documentName,
                        document_type: documentType,
                        created_at: new Date().toISOString(),
                        file: URL.createObjectURL(selectedFile)
                    };
                    
                    setDocuments([newDocument, ...documents]);
                    resetModal();
                }
            }, 150);
        };

        simulateUpload();
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setDocumentName('');
        setDocumentType('resume');
        setLoading(false);
        setUploadProgress(0);
    };

    // Document actions
     const handleDownload = (doc) => {
        const link = window.document.createElement('a');
        link.href = doc.file;
        link.download = doc.name;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        console.log('Downloading:', doc.name);
    };


    const handleDelete = (documentId) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            setDocuments(documents.filter(doc => doc.id !== documentId));
            console.log('Deleted document with ID:', documentId);
        }
    };

    const handleView = (doc) => {
        window.open(doc.file, '_blank');
        console.log('Viewing:', doc.name);
    };

    // Helper functions
    const getDocumentIcon = (type) => {
        const icons = {
            resume: FileText,
            cover_letter: FilePenLine,
            portfolio: Palette,
            certificate: Award,
            other: Paperclip
        };
        return icons[type] || Paperclip;
    };

    const getDocumentTypeColor = (type) => {
        const colors = {
            resume: styles.resumeType,
            cover_letter: styles.coverLetterType,
            portfolio: styles.portfolioType,
            certificate: styles.certificateType,
            other: styles.otherType
        };
        return colors[type] || styles.otherType;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <>
            <SideBar />
            <div className={styles.documentsContainer}>
                <div className={styles.documentsHeader}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>
                            <FileText size={28} />
                            My Documents
                        </h1>
                        <p className={styles.pageSubtitle}>
                            Manage your resumes, cover letters, and certificates
                        </p>
                    </div>
                    <button 
                        className={styles.addButton}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus size={20} />
                        Upload Document
                    </button>
                </div>

                <div className={styles.documentsGrid}>
                    {documents.map((doc) => {
                        const IconComponent = getDocumentIcon(doc.document_type);
                        return (
                            <div key={doc.id} className={styles.documentCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.documentIcon}>
                                        <IconComponent size={28} />
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button 
                                            className={styles.actionBtn} 
                                            title="Download"
                                            onClick={() => handleDownload(doc)}
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button 
                                            className={styles.actionBtn} 
                                            title="Delete"
                                            onClick={() => handleDelete(doc.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className={styles.cardContent}>
                                    <h3 className={styles.documentName}>{doc.name}</h3>
                                    <span className={`${styles.documentType} ${getDocumentTypeColor(doc.document_type)}`}>
                                        {doc.document_type.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <p className={styles.documentDate}>
                                        Uploaded: {formatDate(doc.created_at)}
                                    </p>
                                </div>
                                
                                <div className={styles.cardFooter}>
                                    <button 
                                        className={styles.viewButton}
                                        onClick={() => handleView(doc)}
                                    >
                                        <Eye size={18} />
                                        View
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Enhanced Upload Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2>Upload New Document</h2>
                                <button 
                                    className={styles.closeButton}
                                    onClick={() => resetModal()}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleFileUpload} className={styles.uploadForm}>
                                {/* Document Name Input */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="documentName">Document Name</label>
                                    <input
                                        type="text"
                                        id="documentName"
                                        value={documentName}
                                        onChange={(e) => setDocumentName(e.target.value)}
                                        placeholder="e.g., My_Resume_2024"
                                        required
                                    />
                                </div>

                                {/* Document Type Select */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="documentType">Document Type</label>
                                    <select
                                        id="documentType"
                                        value={documentType}
                                        onChange={(e) => setDocumentType(e.target.value)}
                                    >
                                        <option value="resume">Resume</option>
                                        <option value="cover_letter">Cover Letter</option>
                                        <option value="portfolio">Portfolio</option>
                                        <option value="certificate">Certificate</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Cool File Upload Area */}
                                <div className={styles.formGroup}>
                                    <label>Choose File</label>
                                    <div 
                                        className={`${styles.fileUploadArea} ${
                                            dragOver ? styles.dragOver : ''
                                        } ${selectedFile ? styles.hasFile : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            className={styles.fileUploadInput}
                                            accept=".pdf,.doc,.docx,.txt"
                                            onChange={handleFileInputChange}
                                        />
                                        
                                        {!selectedFile ? (
                                            <>
                                                <CloudUpload size={48} className={styles.uploadIcon} />
                                                <p className={styles.uploadText}>
                                                    <span className={styles.highlight}>Click to upload</span> or drag and drop
                                                </p>
                                                <p className={styles.uploadSubtext}>
                                                    PDF, DOC, DOCX, TXT (MAX. 10MB)
                                                </p>
                                            </>
                                        ) : (
                                            <div className={styles.selectedFileDisplay}>
                                                <FileText size={24} className={styles.fileIcon} />
                                                <div className={styles.fileDetails}>
                                                    <div className={styles.fileName}>{selectedFile.name}</div>
                                                    <div className={styles.fileSize}>{formatFileSize(selectedFile.size)}</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.removeFileBtn}
                                                    onClick={handleRemoveFile}
                                                    title="Remove file"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Progress */}
                                {loading && (
                                    <div className={styles.uploadProgress}>
                                        <div className={styles.progressHeader}>
                                            <span className={styles.progressText}>Uploading...</span>
                                            <span className={styles.progressPercent}>{uploadProgress}%</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div 
                                                className={styles.progressFill}
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Modal Actions */}
                                <div className={styles.modalActions}>
                                    <button 
                                        type="button" 
                                        className={styles.cancelButton}
                                        onClick={() => resetModal()}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className={styles.uploadButton}
                                        disabled={loading || !selectedFile || !documentName}
                                    >
                                        <Upload size={18} />
                                        {loading ? 'Uploading...' : 'Upload'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Documents;