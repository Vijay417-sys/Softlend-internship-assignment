import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorMessage.module.css';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.container} role="alert" aria-live="assertive">
      <div className={styles.icon} aria-hidden="true">⚠️</div>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>
        {message || 'Failed to load your data. Please try again.'}
      </p>
      {onRetry && (
        <button
          id="retry-btn"
          className={styles.retryBtn}
          onClick={onRetry}
          aria-label="Retry loading data"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorMessage;
