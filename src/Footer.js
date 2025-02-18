// Footer.js
import React from 'react';
import { APP_VERSION, BUILD_DATE } from './versions';

function Footer() {
  return (
    <footer className="footer">
      <span>
        App version: {APP_VERSION} Updated: {BUILD_DATE}
      </span>
    </footer>
  );
}

export default Footer;
