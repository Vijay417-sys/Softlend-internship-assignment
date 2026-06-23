import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import CreditDashboard from './components/CreditDashboard/CreditDashboard';
import LoanOffers from './components/LoanOffers/LoanOffers';
import EMICalculator from './components/EMICalculator/EMICalculator';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';

const TABS = [
  { id: 'dashboard', label: '📊 Credit Dashboard' },
  { id: 'offers',    label: '💰 Loan Offers' },
  { id: 'emi',       label: '🧮 EMI Calculator' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Theme: 'night' | 'day'  — persisted in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('softlend-theme') || 'night';
  });

  // Apply theme attribute to <html> whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('softlend-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'night' ? 'day' : 'night'));

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise((res) => setTimeout(res, 800));
        const response = await fetch('/data.json', { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load your data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const isDay = theme === 'day';

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>Soft<span className={styles.logoBold}>lend</span></span>
          </div>

          <div className={styles.headerRight}>
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={isDay ? 'Switch to Night mode' : 'Switch to Day mode'}
              title={isDay ? 'Night mode' : 'Day mode'}
            >
              <span className={styles.themeToggleTrack} data-day={isDay ? 'true' : 'false'}>
                <span className={styles.themeToggleThumb}>
                  {isDay ? '☀️' : '🌙'}
                </span>
              </span>
              <span className={styles.themeToggleLabel}>
                {isDay ? 'Day' : 'Night'}
              </span>
            </button>

            {data && (
              <div className={styles.userPill}>
                <span className={styles.userAvatar}>{data.customer.name.charAt(0)}</span>
                <span className={styles.userName}>{data.customer.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className={styles.nav} role="navigation" aria-label="Main navigation">
        <div className={styles.navInner}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`${styles.navTab} ${activeTab === tab.id ? styles.navTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
          <span
            className={styles.navIndicator}
            style={{
              transform: `translateX(${TABS.findIndex((t) => t.id === activeTab) * 100}%)`,
              width: `${100 / TABS.length}%`,
            }}
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main} id={`panel-${activeTab}`} role="tabpanel">
        {loading && <LoadingSpinner />}
        {!loading && error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
        {!loading && !error && data && (
          <>
            {activeTab === 'dashboard' && <CreditDashboard data={data} />}
            {activeTab === 'offers'    && <LoanOffers data={data} />}
            {activeTab === 'emi'       && <EMICalculator />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 Softlend Fintech Pvt. Ltd. — Credit data simulated for demo purposes.</p>
      </footer>
    </div>
  );
}

export default App;
