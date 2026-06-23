import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ScoreSimulator.module.css';
import { getScoreCategory } from '../../utils';

function ScoreSimulator({ customer, scoreFactors, loanOffers }) {
  const [selected, setSelected] = useState({});

  const toggleFactor = (factor) => {
    setSelected((prev) => ({
      ...prev,
      [factor]: !prev[factor],
    }));
  };

  const selectedGain = scoreFactors.reduce((sum, f) => {
    return selected[f.factor] ? sum + f.estimated_score_gain : sum;
  }, 0);

  const projectedScore = Math.min(900, customer.cibil_score + selectedGain);
  const category = getScoreCategory(projectedScore);

  const colorMap = { red: '#ef4444', amber: '#f59e0b', green: '#10b981' };
  const projectedColor = colorMap[category];

  // Which locked offers would unlock at projected score
  const newlyUnlocked = loanOffers.filter(
    (o) =>
      o.min_score_required > customer.cibil_score &&
      o.min_score_required <= projectedScore
  );

  const progressPct = Math.min(100, ((projectedScore - 300) / (900 - 300)) * 100);

  return (
    <section className={styles.container} aria-label="Score Simulator">
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>🔮 What If? Score Simulator</h2>
          <p className={styles.subtitle}>
            Select actions to see how your score improves in real time
          </p>
        </div>
        <div className={styles.projectedBadge} style={{ borderColor: projectedColor }}>
          <span className={styles.projectedNum} style={{ color: projectedColor }}>
            {projectedScore}
          </span>
          <span className={styles.projectedLabel}>Projected</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack} aria-label={`Projected score: ${projectedScore}`}>
        <div
          className={styles.progressBar}
          style={{
            width: `${progressPct}%`,
            background: `linear-gradient(90deg, ${projectedColor}80, ${projectedColor})`,
          }}
        />
        <div
          className={styles.currentMarker}
          style={{
            left: `${((customer.cibil_score - 300) / 600) * 100}%`,
          }}
          title={`Current: ${customer.cibil_score}`}
        />
      </div>
      <div className={styles.progressLabels}>
        <span>300</span>
        <span>650 (Fair)</span>
        <span>750 (Good)</span>
        <span>900</span>
      </div>

      {/* Factor toggles */}
      <div className={styles.factors}>
        {scoreFactors.map((f) => (
          <label
            key={f.factor}
            className={`${styles.factorToggle} ${selected[f.factor] ? styles.factorSelected : ''}`}
            htmlFor={`sim-${f.factor}`}
          >
            <input
              type="checkbox"
              id={`sim-${f.factor}`}
              className={styles.checkbox}
              checked={!!selected[f.factor]}
              onChange={() => toggleFactor(f.factor)}
              aria-label={`Simulate: ${f.factor} (+${f.estimated_score_gain} pts)`}
            />
            <span className={styles.factorInfo}>
              <span className={styles.factorName}>{f.factor}</span>
              <span className={styles.factorAction}>{f.action}</span>
            </span>
            <span className={styles.factorGain}>+{f.estimated_score_gain} pts</span>
          </label>
        ))}
      </div>

      {/* Newly unlocked offers */}
      {newlyUnlocked.length > 0 && (
        <div className={styles.unlockAlert} role="status" aria-live="polite">
          <span className={styles.unlockIcon}>🎉</span>
          <div>
            <p className={styles.unlockTitle}>New offers you'd unlock!</p>
            <ul className={styles.unlockList}>
              {newlyUnlocked.map((o) => (
                <li key={o.id}>
                  <strong>{o.lender}</strong> — requires {o.min_score_required}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedGain === 0 && (
        <p className={styles.hint}>☝️ Check one or more actions above to simulate your improvement</p>
      )}
    </section>
  );
}

ScoreSimulator.propTypes = {
  customer: PropTypes.shape({
    cibil_score: PropTypes.number.isRequired,
  }).isRequired,
  scoreFactors: PropTypes.array.isRequired,
  loanOffers: PropTypes.array.isRequired,
};

export default ScoreSimulator;
