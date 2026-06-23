import React from 'react';
import styles from './LoadingSpinner.module.css';

function LoadingSpinner() {
  return (
    <div className={styles.container} role="status" aria-label="Loading your data">
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner} aria-hidden="true" />
        <div className={styles.spinnerInner} aria-hidden="true" />
      </div>
      <p className={styles.text}>Loading your credit profile…</p>

      {/* Skeleton cards */}
      <div className={styles.skeletons}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    </div>
  );
}

export default LoadingSpinner;
