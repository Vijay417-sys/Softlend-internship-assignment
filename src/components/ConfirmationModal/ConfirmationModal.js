import React from 'react';
import PropTypes from 'prop-types';
import styles from './ConfirmationModal.module.css';
import { formatCurrency } from '../../utils';

function ConfirmationModal({ offer, onConfirm, onCancel }) {
  if (!offer) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={styles.modal} role="document">
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>Confirm Loan Offer</h2>
          <button
            id="modal-close-btn"
            className={styles.closeBtn}
            onClick={onCancel}
            aria-label="Close confirmation dialog"
          >
            ✕
          </button>
        </div>

        <div className={styles.lenderBadge}>
          <span className={styles.lenderInitial}>{offer.lender.charAt(0)}</span>
          <div>
            <p className={styles.lenderName}>{offer.lender}</p>
            <p className={styles.lenderSub}>Personal Loan</p>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailKey}>Loan Amount</span>
            <span className={styles.detailVal}>{formatCurrency(offer.amount)}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailKey}>Interest Rate</span>
            <span className={styles.detailVal}>{offer.interest_rate}% p.a.</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailKey}>Tenure</span>
            <span className={styles.detailVal}>{offer.tenure_months} months</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailKey}>Monthly EMI</span>
            <span className={`${styles.detailVal} ${styles.highlight}`}>{formatCurrency(offer.emi)}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailKey}>Processing Fee</span>
            <span className={styles.detailVal}>{formatCurrency(offer.processing_fee)}</span>
          </div>
        </div>

        <div className={styles.disclaimer}>
          <span>ℹ️</span>
          <p>This is a demo application. No real loan application will be submitted.</p>
        </div>

        <div className={styles.actions}>
          <button
            id="modal-cancel-btn"
            className={styles.cancelBtn}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            id="modal-confirm-btn"
            className={styles.confirmBtn}
            onClick={() => onConfirm(offer)}
          >
            ✓ Accept Offer
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationModal.propTypes = {
  offer: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
