import React, { createContext, useContext, useState, useCallback } from 'react';
import { documentsAPI } from './api';

const DocumentsContext = createContext();

export const useDocuments = () => {
    const context = useContext(DocumentsContext);
    if (!context) throw new Error('useDocuments must be used within a DocumentsProvider');
    return context;
};

export const DocumentsProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);

    const clearError = useCallback(() => setError(null), []);

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await documentsAPI.getUserDocuments();
            setDocuments(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load documents');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadDocument = useCallback(async (formData) => {
        try {
            setLoading(true);
            setUploadProgress(0);
            setError(null);

            const response = await documentsAPI.uploadUserDocument(formData, {
                onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
            });

            setDocuments(prev => [response.data, ...prev]);
            setUploadProgress(0);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload document');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteDocument = useCallback(async (id) => {
        try {
            await documentsAPI.deleteUserDocument(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete document');
            throw err;
        }
    }, []);

    const viewDocument = useCallback((doc) => {
        window.open(doc.file_url, '_blank');
        console.log('Viewing:', doc.name);
    }, []);


    const downloadDocument = useCallback(async (doc) => {
        try {
            const response = await documentsAPI.downloadUserDocument(doc.id, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${doc.name}${doc.file_extension}`); // optionally set dynamic name
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // free memory
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to download document');
            throw err;
        }
    }, []);

    return (
        <DocumentsContext.Provider value={{
            documents,
            loading,
            uploadProgress,
            error,
            fetchDocuments,
            uploadDocument,
            deleteDocument,
            downloadDocument,
            viewDocument,
            clearError,
        }}>
            {children}
        </DocumentsContext.Provider>
    );
};
