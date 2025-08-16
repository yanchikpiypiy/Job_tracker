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
import { useDocuments } from '../context/DocumentContext'; // Import context

const Documents = () => {
    const { 
        documents, 
        loading, 
        uploadProgress, 
        fetchDocuments, 
        uploadDocument, 
        deleteDocument, 
        downloadDocument, 
        viewDocument 
    } = useDocuments();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [documentType, setDocumentType] = useState('resume');
    const [dragOver, setDragOver] = useState(false);
    console.log(documents[0])
    // Fetch documents on mount
    useEffect(() => {
        fetchDocuments().catch(console.error);
    }, [fetchDocuments]);

    // File selection handlers
    const handleFileSelect = (file) => {
        setSelectedFile(file);
        if (!documentName) {
            const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            setDocumentName(nameWithoutExtension);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setDocumentName('');
    };

    // Drag and drop
    const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) handleFileSelect(files[0]);
    };

    // Upload handler
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !documentName) return;

        const formData = new FormData();
        formData.append('actual_file', selectedFile);
        formData.append('name', documentName);
        formData.append('document_type', documentType);
        console.log(`form data ${formData}`)
        try {
            await uploadDocument(formData);
            resetModal();
        } catch (err) {
            console.error(err);
        }
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setDocumentName('');
        setDocumentType('resume');
    };

    // Helper functions
    const getDocumentIcon = (type) => {
        const icons = { resume: FileText, cover_letter: FilePenLine, portfolio: Palette, certificate: Award, other: Paperclip };
        return icons[type] || Paperclip;
    };

    const getDocumentTypeColor = (type) => {
        const colors = { resume: styles.resumeType, cover_letter: styles.coverLetterType, portfolio: styles.portfolioType, certificate: styles.certificateType, other: styles.otherType };
        return colors[type] || styles.otherType;
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024, sizes = ['Bytes','KB','MB','GB'];
        const i = Math.floor(Math.log(bytes)/Math.log(k));
        return parseFloat((bytes/Math.pow(k,i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <>
            <SideBar />
            <div className={styles.documentsContainer}>
                <div className={styles.documentsHeader}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}><FileText size={28}/> My Documents</h1>
                        <p className={styles.pageSubtitle}>Manage your resumes, cover letters, and certificates</p>
                    </div>
                    <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                        <Plus size={20}/> Upload Document
                    </button>
                </div>

                <div className={styles.documentsGrid}>
                    {documents.map((doc) => {
                        const IconComponent = getDocumentIcon(doc.document_type);
                        return (
                            <div key={doc.id} className={styles.documentCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.documentIcon}><IconComponent size={28} /></div>
                                    <div className={styles.cardActions}>
                                        <button className={styles.actionBtn} title="Download" onClick={() => downloadDocument(doc)}><Download size={18}/></button>
                                        <button className={styles.actionBtn} title="Delete" onClick={() => deleteDocument(doc.id)}><Trash2 size={18}/></button>
                                    </div>
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.documentName}>{doc.name}</h3>
                                    <span className={`${styles.documentType} ${getDocumentTypeColor(doc.document_type)}`}>
                                        {doc.document_type.replace('_',' ').toUpperCase()}
                                    </span>
                                    <p className={styles.documentDate}>Uploaded: {formatDate(doc.created_at)}</p>
                                </div>

                                <div className={styles.cardFooter}>
                                    <button className={styles.viewButton} onClick={() => viewDocument(doc)}>
                                        <Eye size={18}/> View
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Upload Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2>Upload New Document</h2>
                                <button className={styles.closeButton} onClick={resetModal}><X size={20}/></button>
                            </div>

                            <form onSubmit={handleFileUpload} className={styles.uploadForm}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="documentName">Document Name</label>
                                    <input type="text" id="documentName" value={documentName} onChange={(e) => setDocumentName(e.target.value)} placeholder="e.g., My_Resume_2024" required />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="documentType">Document Type</label>
                                    <select id="documentType" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                                        <option value="resume">Resume</option>
                                        <option value="cover_letter">Cover Letter</option>
                                        <option value="portfolio">Portfolio</option>
                                        <option value="certificate">Certificate</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

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

                                {loading && (
                                    <div className={styles.uploadProgress}>
                                        <div className={styles.progressHeader}>
                                            <span className={styles.progressText}>Uploading...</span>
                                            <span className={styles.progressPercent}>{uploadProgress}%</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }}/>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.cancelButton} onClick={resetModal} disabled={loading}>Cancel</button>
                                    <button type="submit" className={styles.uploadButton} disabled={loading || !selectedFile || !documentName}>
                                        <Upload size={18}/>{loading ? 'Uploading...' : 'Upload'}
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
