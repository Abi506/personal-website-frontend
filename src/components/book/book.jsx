// UploadPdf.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadPdf = () => {
    const [pdf, setPdf] = useState(null);

    const handleFileChange = (e) => {
        setPdf(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!pdf) return alert('Please select a PDF file');
        
        const formData = new FormData();
        formData.append('pdf', pdf);

        try {
            await axios.post('http://localhost:3000/book/upload-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('PDF uploaded successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to upload PDF');
        }
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload PDF</button>
        </div>
    );
};

export default UploadPdf;
