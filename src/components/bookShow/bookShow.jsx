import React, { useEffect, useState } from 'react';

const PdfViewer = ({ pdfId }) => {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch(`/pdf/${pdfId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      }
    };

    fetchPdf();
  }, [pdfId]);

  return (
    <div>
      <h1>PDF Viewer</h1>
      {pdfUrl ? (
        <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfViewer;
