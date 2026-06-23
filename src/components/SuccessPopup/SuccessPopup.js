import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SuccessPopup.module.css';
import { formatCurrency } from '../../utils';

function SuccessPopup({ offer, onClose }) {
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  if (!offer) return null;

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayOut : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`${styles.popup} ${closing ? styles.popupOut : ''}`}>

        {/* Close button */}
        <button
          id="success-close-btn"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close success message"
        >
          ✕
        </button>

        {/* Animated checkmark circle */}
        <div className={styles.iconWrap} aria-hidden="true">
          <svg className={styles.checkCircle} viewBox="0 0 80 80">
            <circle className={styles.circleBg} cx="40" cy="40" r="36" />
            <circle className={styles.circleRing} cx="40" cy="40" r="36" />
            <polyline className={styles.checkMark} points="22,40 34,52 58,28" />
          </svg>
          {/* Confetti dots */}
          {[...Array(8)].map((_, i) => (
            <span key={i} className={styles.confetti} style={{ '--i': i }} aria-hidden="true" />
          ))}
        </div>

        {/* Heading */}
        <h2 id="success-title" className={styles.title}>
          Offer Accepted! 🎉
        </h2>
        <p className={styles.subtitle}>
          Your application with <strong>{offer.lender}</strong> has been submitted successfully.
        </p>

        {/* Offer summary card */}
        <div className={styles.summaryCard}>
          <div className={styles.lenderRow}>
            <span className={styles.lenderAvatar}>{offer.lender.charAt(0)}</span>
            <div>
              <p className={styles.lenderName}>{offer.lender}</p>
              <p className={styles.lenderSub}>Loan Offer #{offer.id}</p>
            </div>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailCell}>
              <span className={styles.detailLabel}>Amount</span>
              <span className={styles.detailValue}>{formatCurrency(offer.amount)}</span>
            </div>
            <div className={styles.detailCell}>
              <span className={styles.detailLabel}>Interest</span>
              <span className={styles.detailValue}>{offer.interest_rate}% p.a.</span>
            </div>
            <div className={styles.detailCell}>
              <span className={styles.detailLabel}>Tenure</span>
              <span className={styles.detailValue}>{offer.tenure_months} mo</span>
            </div>
            <div className={styles.detailCell}>
              <span className={styles.detailLabel}>Monthly EMI</span>
              <span className={`${styles.detailValue} ${styles.emiHighlight}`}>
                {formatCurrency(offer.emi)}
              </span>
            </div>
          </div>
        </div>

        <p className={styles.demoNote}>
          ℹ️ Demo mode — no real application was submitted.
        </p>

        <button
          id="success-done-btn"
          className={styles.doneBtn}
          onClick={handleClose}
        >
          Done
        </button>

        {/* Auto-dismiss progress bar */}
        <div className={styles.progressBar} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.autoClose}>Closes automatically…</p>
      </div>
    </div>
  );
}

SuccessPopup.propTypes = {
  offer: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SuccessPopup;
