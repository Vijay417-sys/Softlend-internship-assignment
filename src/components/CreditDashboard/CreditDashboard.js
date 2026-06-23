import React from 'react';
import PropTypes from 'prop-types';
import styles from './CreditDashboard.module.css';
import ScoreRing from '../ScoreRing/ScoreRing';
import ScoreFactorCard from '../ScoreFactorCard/ScoreFactorCard';
import ScoreSimulator from '../ScoreSimulator/ScoreSimulator';
import { formatDate, getScoreCategory } from '../../utils';

function CreditDashboard({ data }) {
  const { customer, score_factors, loan_offers } = data;

  // Potential score = current + sum of HIGH impact gains
  const highImpactGain = score_factors
    .filter((f) => f.impact === 'high')
    .reduce((sum, f) => sum + f.estimated_score_gain, 0);
  const potentialScore = Math.min(900, customer.cibil_score + highImpactGain);

  const category = getScoreCategory(customer.cibil_score);
  const colorMap = { red: '#ef4444', amber: '#f59e0b', green: '#10b981' };
  const scoreColor = colorMap[category];

  // Progress bar values
  const currentPct = ((customer.cibil_score - 300) / 600) * 100;
  const potentialPct = ((potentialScore - 300) / 600) * 100;

  return (
    <div className={styles.container}>
      {/* Score hero section */}
      <section className={styles.heroSection} aria-label="Credit score overview">
        <div className={styles.heroLeft}>
          <div className={styles.greeting}>
            <span className={styles.wave}>👋</span>
            <div>
              <h1 className={styles.name}>Hello, {customer.name}</h1>
              <p className={styles.id}>Customer ID: {customer.id}</p>
            </div>
          </div>

          <div className={styles.scoreInfo}>
            <p className={styles.scoreInfoLabel}>Your CIBIL Score</p>
            <div className={styles.scoreRingWrap}>
              <ScoreRing score={customer.cibil_score} />
            </div>
            <p className={styles.updatedAt}>
              Last updated: {formatDate(customer.score_updated_at)}
            </p>
          </div>
        </div>

        {/* Potential score card */}
        <div className={styles.heroRight}>
          <div className={styles.potentialCard}>
            <div className={styles.potentialHeader}>
              <span className={styles.potentialIcon}>🚀</span>
              <h2 className={styles.potentialTitle}>Your Potential Score</h2>
            </div>
            <p className={styles.potentialSubtitle}>
              If you fix all high-impact items
            </p>

            <div className={styles.scoreComparison}>
              <div className={styles.scoreBox}>
                <span className={styles.scoreBoxNum} style={{ color: scoreColor }}>
                  {customer.cibil_score}
                </span>
                <span className={styles.scoreBoxLabel}>Current</span>
              </div>
              <div className={styles.scoreArrow}>→</div>
              <div className={styles.scoreBox}>
                <span className={styles.scoreBoxNum} style={{ color: 'var(--color-green)' }}>
                  {potentialScore}
                </span>
                <span className={styles.scoreBoxLabel}>Potential</span>
              </div>
            </div>

            <div className={styles.gainBanner}>
              <span>+{highImpactGain} points</span>
              <span className={styles.gainSub}>possible gain from {score_factors.filter(f => f.impact === 'high').length} high-impact actions</span>
            </div>

            {/* Dual progress bar */}
            <div className={styles.progressTrack} role="img" aria-label={`Score progress from ${customer.cibil_score} to potential ${potentialScore}`}>
              <div
                className={styles.progressPotential}
                style={{ width: `${potentialPct}%` }}
              />
              <div
                className={styles.progressCurrent}
                style={{ width: `${currentPct}%`, background: scoreColor }}
              />
            </div>
            <div className={styles.progressLabels}>
              <span>300</span>
              <span>900</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className={styles.statsRow}>
            {score_factors.map((f) => (
              <div key={f.factor} className={styles.statChip}>
                <span className={`${styles.statImpact} ${
                  f.impact === 'high' ? styles.statHigh :
                  f.impact === 'medium' ? styles.statAmber : styles.statLow
                }`}>
                  {f.impact === 'high' ? '🔴' : f.impact === 'medium' ? '🟡' : '🟢'}
                </span>
                <span className={styles.statLabel}>{f.factor}</span>
                <span className={styles.statGain}>+{f.estimated_score_gain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Improvement plan */}
      <section className={styles.planSection} aria-label="Credit improvement plan">
        <div className={styles.planHeader}>
          <h2 className={styles.planTitle}>📋 Your Improvement Plan</h2>
          <p className={styles.planSubtitle}>
            Fix these factors to unlock better loan offers and improve your credit score
          </p>
        </div>

        <div className={styles.factorGrid}>
          {score_factors.length === 0 ? (
            <p className={styles.emptyFactors}>
              🎉 Great news — no improvement factors found! Your credit health looks excellent.
            </p>
          ) : (
            score_factors.map((factor, index) => (
              <ScoreFactorCard key={factor.factor} factor={factor} index={index} />
            ))
          )}
        </div>
      </section>

      {/* Bonus: Score Simulator */}
      <ScoreSimulator
        customer={customer}
        scoreFactors={score_factors}
        loanOffers={loan_offers}
      />
    </div>
  );
}

CreditDashboard.propTypes = {
  data: PropTypes.shape({
    customer: PropTypes.object.isRequired,
    score_factors: PropTypes.array.isRequired,
    loan_offers: PropTypes.array.isRequired,
  }).isRequired,
};

export default CreditDashboard;
