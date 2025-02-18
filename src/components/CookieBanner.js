// src/components/CookieBanner.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CookieBanner.css';

const CookieBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <span className="cookie-banner-title">🍪 {t('cookieTitle')}</span>
        <p className="cookie-banner-text">
          {t('cookieDescription')}{' '}
          <a href="/cookie-policy" className="cookie-banner-link">
  {t('cookiePolicyLink')}
</a>
        </p>
        <button onClick={handleAccept} className="cookie-banner-accept">
          {t('cookieAccept')}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
