import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './LoanOffers.module.css';
import OfferCard from '../OfferCard/OfferCard';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import SuccessPopup from '../SuccessPopup/SuccessPopup';

const FILTER_TABS = [
  { id: 'all', label: 'All Offers' },
  { id: 'unlocked', label: '✓ Unlocked' },
  { id: 'locked', label: '🔒 Locked' },
];

function LoanOffers({ data }) {
  const { customer, loan_offers } = data;
  const cibilScore = customer.cibil_score;

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [acceptedOffer, setAcceptedOffer] = useState(null);

  // 300ms debounce on search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer); // cleanup
  }, [searchTerm]);

  // Filter & search logic
  const filteredOffers = loan_offers.filter((offer) => {
    const isUnlocked = offer.min_score_required <= cibilScore;

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'unlocked' && isUnlocked) ||
      (activeFilter === 'locked' && !isUnlocked);

    const matchesSearch =
      !debouncedSearch ||
      offer.lender.toLowerCase().includes(debouncedSearch);

    return matchesFilter && matchesSearch;
  });

  const unlockedCount = loan_offers.filter((o) => o.min_score_required <= cibilScore).length;
  const lockedCount = loan_offers.length - unlockedCount;

  const handleAccept = (offer) => {
    setSelectedOffer(offer);
  };

  const handleConfirm = (offer) => {
    setAcceptedOffer(offer);
    setSelectedOffer(null);
  };

  const handleCancel = () => {
    setSelectedOffer(null);
  };

  const handleDismissAccepted = () => {
    setAcceptedOffer(null);
  };

  return (
    <div className={styles.container}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>💰 Loan Offers</h1>
          <p className={styles.subtitle}>
            Personalized offers based on your CIBIL score of{' '}
            <strong style={{ color: 'var(--color-amber)' }}>{cibilScore}</strong>
          </p>
        </div>

        {/* Summary chips */}
        <div className={styles.summaryChips}>
          <div className={styles.chip} style={{ borderColor: 'rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.08)' }}>
            <span className={styles.chipNum} style={{ color: 'var(--color-green)' }}>{unlockedCount}</span>
            <span className={styles.chipLabel}>Unlocked</span>
          </div>
          <div className={styles.chip} style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            <span className={styles.chipNum} style={{ color: 'var(--text-muted)' }}>{lockedCount}</span>
            <span className={styles.chipLabel}>Locked</span>
          </div>
        </div>
      </div>

      {/* Success popup if accepted */}
      {acceptedOffer && (
        <SuccessPopup
          offer={acceptedOffer}
          onClose={handleDismissAccepted}
        />
      )}

      {/* Controls: filter tabs + search */}
      <div className={styles.controls}>
        <div className={styles.filterTabs} role="tablist" aria-label="Filter loan offers">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              id={`filter-${tab.id}`}
              className={`${styles.filterTab} ${activeFilter === tab.id ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter(tab.id)}
              role="tab"
              aria-selected={activeFilter === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          <input
            id="lender-search"
            type="text"
            className={styles.searchInput}
            placeholder="Search lender…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search offers by lender name"
          />
          {searchTerm && (
            <button
              id="clear-search-btn"
              className={styles.clearSearch}
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {debouncedSearch && (
        <p className={styles.resultCount} role="status" aria-live="polite">
          {filteredOffers.length} result{filteredOffers.length !== 1 ? 's' : ''} for "{debouncedSearch}"
        </p>
      )}

      {/* Offer grid or empty state */}
      {filteredOffers.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <span className={styles.emptyIcon} aria-hidden="true">
            {activeFilter === 'unlocked' || unlockedCount === 0 ? '🔒' : '🔍'}
          </span>
          <h2 className={styles.emptyTitle}>
            {debouncedSearch
              ? `No offers found for "${debouncedSearch}"`
              : unlockedCount === 0
              ? 'No offers available yet'
              : 'No offers match this filter'}
          </h2>
          <p className={styles.emptyMessage}>
            {unlockedCount === 0 && !debouncedSearch
              ? 'Improve your credit score to unlock offers. Fix high-impact items from the Credit Dashboard.'
              : 'Try a different filter or clear your search.'}
          </p>
        </div>
      ) : (
        <div className={styles.offersGrid}>
          {filteredOffers.map((offer, index) => (
            <div key={offer.id} style={{ animationDelay: `${index * 0.08}s` }}>
              <OfferCard
                offer={offer}
                cibilScore={cibilScore}
                onAccept={handleAccept}
              />
            </div>
          ))}
        </div>
      )}

      {/* Confirmation modal */}
      {selectedOffer && (
        <ConfirmationModal
          offer={selectedOffer}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

LoanOffers.propTypes = {
  data: PropTypes.shape({
    customer: PropTypes.object.isRequired,
    loan_offers: PropTypes.array.isRequired,
  }).isRequired,
};

export default LoanOffers;
