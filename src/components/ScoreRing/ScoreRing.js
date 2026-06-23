import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './ScoreRing.module.css';
import { getScoreCategory } from '../../utils';

const SCORE_MIN = 300;
const SCORE_MAX = 900;
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreRing({ score }) {
  const circleRef = useRef(null);
  const category = getScoreCategory(score);

  const percentage = Math.min(1, Math.max(0, (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)));
  const dashOffset = CIRCUMFERENCE * (1 - percentage);

  const colorMap = {
    red: '#ef4444',
    amber: '#f59e0b',
    green: '#10b981',
  };
  const strokeColor = colorMap[category];

  const labelMap = {
    red: 'Poor',
    amber: 'Fair',
    green: 'Good',
  };
  const label = labelMap[category];

  useEffect(() => {
    if (circleRef.current) {
      // Animate from zero to actual offset
      circleRef.current.style.strokeDashoffset = CIRCUMFERENCE;
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          circleRef.current.style.strokeDashoffset = dashOffset;
        });
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [dashOffset]);

  return (
    <div className={styles.wrapper} aria-label={`CIBIL Score: ${score} — ${label}`}>
      <svg
        className={styles.svg}
        viewBox="0 0 200 200"
        width="200"
        height="200"
        aria-hidden="true"
      >
        {/* Background glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Track circle */}
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="14"
        />

        {/* Score arc */}
        <circle
          ref={circleRef}
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 100 100)"
          filter="url(#glow)"
          className={styles.arc}
        />
      </svg>

      {/* Center text */}
      <div className={styles.center}>
        <span className={styles.score} style={{ color: strokeColor }}>
          {score}
        </span>
        <span className={styles.label} style={{ color: strokeColor }}>
          {label}
        </span>
        <span className={styles.range}>out of 900</span>
      </div>
    </div>
  );
}

ScoreRing.propTypes = {
  score: PropTypes.number.isRequired,
};

export default ScoreRing;
