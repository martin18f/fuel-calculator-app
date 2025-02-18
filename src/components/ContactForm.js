// src/components/ContactForm.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from 'emailjs-com';
import './ContactForm.css';

const ContactForm = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Nastavte parametre podľa vášho template v EmailJS
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      // Ak vo svojom template nepoužívate toto pole, môžete ho vynechať,
      // alebo nastaviť priamo v šablóne na "dsnextgen.eu@gmail.com"
      to_email: 'dsnextgen.eu@gmail.com'
    };

    // Nahraďte 'service_c09je8q', 'template_gsqqfxt' a 'SZJ0VCwv7O-V7X0__'
    // hodnotami z vášho EmailJS účtu.
    emailjs.send('service_c09je8q', 'template_gsqqfxt', templateParams, 'SZJ0VCwv7O-V7X0__')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setSubmitted(true);
      }, (error) => {
        console.log('FAILED...', error);
        alert(t('errorSendingMessage') || 'Error sending message. Please try again later.');
      });
  };

  return (
    <div className="contact-form-container">
      <h2 className="contact-title">{t('contactTitle')}</h2>
      <p className="contact-message">{t('contactMessage')}</p>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="contact-name">{t('nameLabel')}</label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-email">{t('emailLabel')}</label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">{t('messageLabel')}</label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="contact-submit-button">
            {t('submitLabel')}
          </button>
        </form>
      ) : (
        <p className="thank-you-message">{t('thankYouMessage')}</p>
      )}
    </div>
  );
};

export default ContactForm;
