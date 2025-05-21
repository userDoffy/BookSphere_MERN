import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReadBook = () => {
  const location = useLocation();
  const id = location.state.id;
  const bookTitle = location.state.title;

  const [pdfUrl, setPdfUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setPdfUrl(`https://booksphere-mern.onrender.com/user/getbookpdf/${id}`);
  }, [id]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    document.body.style.overflow = isFullscreen ? 'auto' : 'hidden'; // prevent background scroll
  };

  return (
    <div
      className={`p-2 ${isFullscreen ? 'fullscreen-container' : 'container'}`}
      style={{ backgroundColor: '#fefefe' }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
        <h5 className="mb-2 mb-md-0">{bookTitle}</h5>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-success btn-sm"
            download
          >
            Download
          </a>
        </div>
      </div>

      <div className="iframe-wrapper">
        <iframe
          src={pdfUrl}
          title="Book PDF"
          style={{
            width: '100%',
            height: isFullscreen ? 'calc(100vh - 70px)' : 'calc(100dvh - 160px)',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#f8f9fa',
          }}
        />
      </div>
    </div>
  );
};

export default ReadBook;
