import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light text-dark small">
      <div className="container-fluid py-2 text-center">
        <div className="mb-1">&copy; {new Date().getFullYear()} BookSphere. All rights reserved.</div>
        <div>
          <Link to="/privacy" className="text-dark text-decoration-none mx-2">Privacy Policy</Link>|
          <Link to="/terms" className="text-dark text-decoration-none mx-2">Terms of Service</Link>|
          <Link to="/contact" className="text-dark text-decoration-none mx-2">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
