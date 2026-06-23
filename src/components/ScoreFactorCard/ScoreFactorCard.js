import React from 'react';
import PropTypes from 'prop-types';
import styles from './ScoreFactorCard.module.css';

const IMPACT_CONFIG = {
  high: { label: 'HIGH', className: styles.badgeRed, icon: '🔴' },
  medium: { label: 'MEDIUM', className: styles.badgeAmber, icon: '🟡' },
  low: { label: 'LOW', className: styles.badgeGreen, icon: '🟢' },
};

function ScoreFactorCard({ factor, index }) {
  const impact = IMPACT_CONFIG[factor.impact] || IMPACT_CONFIG.low;

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 0.1}s` }}
      aria-label={`Score factor: ${factor.factor}`}
    >
      <div className={styles.header}>
        <h3 className={styles.factorName}>{factor.factor}</h3>
        <span className={`${styles.badge} ${impact.className}`}>
          {impact.icon} {impact.label}
        </span>
      </div>

      <div className={styles.values}>
        <div className={styles.valueBlock}>
          <span className={styles.valueLabel}>Current</span>
          <span className={styles.valueCurrent}>{factor.current_value}</span>
        </div>
        <div className={styles.arrow} aria-hidden="true">→</div>
        <div className={styles.valueBlock}>
          <span className={styles.valueLabel}>Ideal</span>
          <span className={styles.valueIdeal}>{factor.ideal_value}</span>
        </div>
        <div className={styles.gain} aria-label={`Estimated score gain: +${factor.estimated_score_gain} points`}>
          <span className={styles.gainNumber}>+{factor.estimated_score_gain}</span>
          <span className={styles.gainLabel}>pts</span>
        </div>
      </div>

      <div className={styles.actionBox}>
        <span className={styles.actionIcon} aria-hidden="true">💡</span>
        <p className={styles.actionText}>{factor.action}</p>
      </div>
    </article>
  );
}

ScoreFactorCard.propTypes = {
  factor: PropTypes.shape({
    factor: PropTypes.string.isRequired,
    current_value: PropTypes.string.isRequired,
    ideal_value: PropTypes.string.isRequired,
    impact: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
    estimated_score_gain: PropTypes.number.isRequired,
    action: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
};

ScoreFactorCard.defaultProps = {
  index: 0,
};

export default ScoreFactorCard;
