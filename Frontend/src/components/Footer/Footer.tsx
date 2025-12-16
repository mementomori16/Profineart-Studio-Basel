import React from 'react';
import './footer.scss'; 

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>
        &copy; 2026 Profineart Studio Basel. All rights reserved. |
        <a href="/legalinfo" className="footer-link"> Legal Info</a>
      </p>
    </footer>
  );
};

export default Footer;