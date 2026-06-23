import React from 'react';
import PropTypes from 'prop-types';
import styles from './OfferCard.module.css';
import { formatCurrency } from '../../utils';

function OfferCard({ offer, cibilScore, onAccept }) {
  const isUnlocked = offer.min_score_required <= cibilScore;
  const scoreGap = offer.min_score_required - cibilScore;

  return (
    <article
      className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`}
      aria-label={`${offer.lender} — ${isUnlocked ? 'Unlocked offer' : 'Locked offer'}`}
    >
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.lenderInfo}>
          <div className={styles.lenderAvatar} aria-hidden="true">
            {offer.lender.charAt(0)}
          </div>
          <div>
            <h3 className={styles.lenderName}>{offer.lender}</h3>
            <span className={styles.offerId}>Offer #{offer.id}</span>
          </div>
        </div>
        <div className={styles.statusArea}>
          {isUnlocked ? (
            <span className={styles.badgeUnlocked} role="img" aria-label="Unlocked">
              ✓ Unlocked
            </span>
          ) : (
            <span className={styles.badgeLocked} role="img" aria-label="Locked">
              🔒 Locked
            </span>
          )}
          <span className={styles.statusBadge}>{offer.status}</span>
        </div>
      </div>

      {isUnlocked ? (
        /* ===== UNLOCKED CONTENT ===== */
        <>
          <div className={styles.amountRow}>
            <span className={styles.amountLabel}>Loan Amount</span>
            <span className={styles.amount}>{formatCurrency(offer.amount)}</span>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Interest Rate</span>
              <span className={styles.detailValue}>{offer.interest_rate}%</span>
              <span className={styles.detailSub}>per annum</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Tenure</span>
              <span className={styles.detailValue}>{offer.tenure_months}</span>
              <span className={styles.detailSub}>months</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Monthly EMI</span>
              <span className={`${styles.detailValue} ${styles.emiValue}`}>
                {formatCurrency(offer.emi)}
              </span>
              <span className={styles.detailSub}>per month</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Processing Fee</span>
              <span className={styles.detailValue}>{formatCurrency(offer.processing_fee)}</span>
              <span className={styles.detailSub}>one time</span>
            </div>
          </div>

          <div className={styles.minScoreRow}>
            <span className={styles.minScoreLabel}>Min. CIBIL required</span>
            <span className={styles.minScoreValue}>{offer.min_score_required}</span>
          </div>

          <button
            id={`accept-btn-${offer.id}`}
            className={styles.acceptBtn}
            onClick={() => onAccept(offer)}
            aria-label={`Accept loan offer from ${offer.lender}`}
          >
            Accept Offer →
          </button>
        </>
      ) : (
        /* ===== LOCKED CONTENT ===== */
        <div className={styles.lockedBody}>
          <div className={styles.lockedIcon} aria-hidden="true">🔒</div>
          <p className={styles.lockedTitle}>Offer Locked</p>
          <p className={styles.lockedMessage}>
            Fix your credit to unlock — improve score by{' '}
            <strong className={styles.lockedGap}>{scoreGap} pts</strong>
          </p>
          <div className={styles.lockedDetails}>
            <span>{formatCurrency(offer.amount)}</span>
            <span>·</span>
            <span>{offer.interest_rate}% p.a.</span>
            <span>·</span>
            <span>{offer.tenure_months} months</span>
          </div>
          <div className={styles.minScoreRow}>
            <span className={styles.minScoreLabel}>Requires score</span>
            <span className={`${styles.minScoreValue} ${styles.minScoreLocked}`}>
              {offer.min_score_required}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

OfferCard.propTypes = {
  offer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    lender: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    interest_rate: PropTypes.number.isRequired,
    tenure_months: PropTypes.number.isRequired,
    processing_fee: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    emi: PropTypes.number.isRequired,
    min_score_required: PropTypes.number.isRequired,
  }).isRequired,
  cibilScore: PropTypes.number.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default OfferCard;
