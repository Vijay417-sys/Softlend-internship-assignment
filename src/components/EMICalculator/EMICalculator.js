import React, { useState, useMemo } from 'react';
import styles from './EMICalculator.module.css';
import { calculateEMI, formatCurrency } from '../../utils';

// Default values pre-filled
const DEFAULTS = {
  principal: '500000',
  rate: '10.5',
  tenure: '36',
};

// Slider config
const SLIDER_CONFIG = {
  principal: { min: 10000,  max: 10000000, step: 10000,  label: 'Principal Amount (₹)',   unit: '₹' },
  rate:      { min: 1,      max: 30,       step: 0.1,    label: 'Annual Interest Rate (%)', unit: '%' },
  tenure:    { min: 3,      max: 360,      step: 1,      label: 'Tenure (Months)',          unit: 'mo' },
};

// Quick preset loan options
const PRESETS = [
  { label: 'Home Loan',       principal: '5000000', rate: '8.5',  tenure: '240' },
  { label: 'Car Loan',        principal: '700000',  rate: '9.0',  tenure: '60'  },
  { label: 'Personal Loan',   principal: '300000',  rate: '14.0', tenure: '36'  },
  { label: 'Education Loan',  principal: '1500000', rate: '10.5', tenure: '84'  },
];

function EMICalculator() {
  const [principal, setPrincipal] = useState(DEFAULTS.principal);
  const [rate,      setRate]      = useState(DEFAULTS.rate);
  const [tenure,    setTenure]    = useState(DEFAULTS.tenure);
  const [activePreset, setActivePreset] = useState(null);

  const emi = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const n = parseFloat(tenure);
    if (p > 0 && r > 0 && n > 0) return calculateEMI(p, r, n);
    return null;
  }, [principal, rate, tenure]);

  const totalPayable  = emi ? emi * parseFloat(tenure) : null;
  const totalInterest = totalPayable ? totalPayable - parseFloat(principal) : null;
  const principalPct  = totalPayable ? (parseFloat(principal) / totalPayable) * 100 : 0;
  const interestPct   = totalPayable ? (totalInterest / totalPayable) * 100 : 0;

  // Validate & set numeric text input
  const handleTextInput = (setter) => (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) setter(val);
  };

  const applyPreset = (preset, idx) => {
    setPrincipal(preset.principal);
    setRate(preset.rate);
    setTenure(preset.tenure);
    setActivePreset(idx);
  };

  const handleReset = () => {
    setPrincipal(DEFAULTS.principal);
    setRate(DEFAULTS.rate);
    setTenure(DEFAULTS.tenure);
    setActivePreset(null);
  };

  // Slider fill gradient helper
  const sliderFill = (value, min, max) => {
    const pct = ((parseFloat(value) - min) / (max - min)) * 100;
    return `linear-gradient(to right, var(--color-primary) ${pct}%, var(--bg-elevated) ${pct}%)`;
  };

  return (
    <section className={styles.container} aria-label="EMI Calculator">
      <div className={styles.header}>
        <h2 className={styles.title}>🧮 EMI Calculator</h2>
        <p className={styles.subtitle}>
          Calculate your monthly EMI for any loan amount, rate, and tenure
        </p>
      </div>

      {/* Quick Presets */}
      <div className={styles.presets} aria-label="Quick loan presets">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            id={`preset-${i}`}
            className={`${styles.presetBtn} ${activePreset === i ? styles.presetActive : ''}`}
            onClick={() => applyPreset(p, i)}
            aria-pressed={activePreset === i}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {/* Form */}
        <div className={styles.form}>

          {/* Principal */}
          <div className={styles.field}>
            <div className={styles.fieldHeader}>
              <label htmlFor="emi-principal" className={styles.label}>
                {SLIDER_CONFIG.principal.label}
              </label>
              <span className={styles.fieldValue}>
                {formatCurrency(parseFloat(principal) || 0)}
              </span>
            </div>
            <input
              type="range"
              id="emi-principal-slider"
              className={styles.slider}
              min={SLIDER_CONFIG.principal.min}
              max={SLIDER_CONFIG.principal.max}
              step={SLIDER_CONFIG.principal.step}
              value={parseFloat(principal) || SLIDER_CONFIG.principal.min}
              onChange={(e) => { setPrincipal(e.target.value); setActivePreset(null); }}
              style={{ background: sliderFill(principal || SLIDER_CONFIG.principal.min, SLIDER_CONFIG.principal.min, SLIDER_CONFIG.principal.max) }}
              aria-label="Principal amount slider"
            />
            <div className={styles.sliderRange}>
              <span>₹10K</span>
              <div className={styles.inputWrap}>
                <span className={styles.inputPrefix}>₹</span>
                <input
                  id="emi-principal"
                  type="text"
                  className={styles.input}
                  value={principal}
                  onChange={handleTextInput(setPrincipal)}
                  placeholder="e.g. 500000"
                  inputMode="decimal"
                />
              </div>
              <span>₹1Cr</span>
            </div>
          </div>

          {/* Rate */}
          <div className={styles.field}>
            <div className={styles.fieldHeader}>
              <label htmlFor="emi-rate" className={styles.label}>
                {SLIDER_CONFIG.rate.label}
              </label>
              <span className={styles.fieldValue}>{rate || 0}%</span>
            </div>
            <input
              type="range"
              id="emi-rate-slider"
              className={styles.slider}
              min={SLIDER_CONFIG.rate.min}
              max={SLIDER_CONFIG.rate.max}
              step={SLIDER_CONFIG.rate.step}
              value={parseFloat(rate) || SLIDER_CONFIG.rate.min}
              onChange={(e) => { setRate(e.target.value); setActivePreset(null); }}
              style={{ background: sliderFill(rate || SLIDER_CONFIG.rate.min, SLIDER_CONFIG.rate.min, SLIDER_CONFIG.rate.max) }}
              aria-label="Interest rate slider"
            />
            <div className={styles.sliderRange}>
              <span>1%</span>
              <div className={styles.inputWrap}>
                <input
                  id="emi-rate"
                  type="text"
                  className={styles.input}
                  value={rate}
                  onChange={handleTextInput(setRate)}
                  placeholder="e.g. 10.5"
                  inputMode="decimal"
                />
                <span className={styles.inputSuffix}>%</span>
              </div>
              <span>30%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className={styles.field}>
            <div className={styles.fieldHeader}>
              <label htmlFor="emi-tenure" className={styles.label}>
                {SLIDER_CONFIG.tenure.label}
              </label>
              <span className={styles.fieldValue}>{tenure || 0} months</span>
            </div>
            <input
              type="range"
              id="emi-tenure-slider"
              className={styles.slider}
              min={SLIDER_CONFIG.tenure.min}
              max={SLIDER_CONFIG.tenure.max}
              step={SLIDER_CONFIG.tenure.step}
              value={parseFloat(tenure) || SLIDER_CONFIG.tenure.min}
              onChange={(e) => { setTenure(e.target.value); setActivePreset(null); }}
              style={{ background: sliderFill(tenure || SLIDER_CONFIG.tenure.min, SLIDER_CONFIG.tenure.min, SLIDER_CONFIG.tenure.max) }}
              aria-label="Tenure slider"
            />
            <div className={styles.sliderRange}>
              <span>3 mo</span>
              <div className={styles.inputWrap}>
                <input
                  id="emi-tenure"
                  type="text"
                  className={styles.input}
                  value={tenure}
                  onChange={handleTextInput(setTenure)}
                  placeholder="e.g. 36"
                  inputMode="numeric"
                />
                <span className={styles.inputSuffix}>mo</span>
              </div>
              <span>360 mo</span>
            </div>
          </div>

          <button
            id="emi-reset-btn"
            className={styles.resetBtn}
            onClick={handleReset}
            aria-label="Reset EMI calculator to defaults"
          >
            ↺ Reset to Defaults
          </button>
        </div>

        {/* Result */}
        {emi !== null ? (
          <div className={styles.result} aria-live="polite" role="region" aria-label="EMI result">
            <div className={styles.emiDisplay}>
              <span className={styles.emiLabel}>Monthly EMI</span>
              <span className={styles.emiValue}>{formatCurrency(emi)}</span>
              <span className={styles.emiSub}>Every month for {tenure} months</span>
            </div>

            <div className={styles.breakdown}>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownKey}>🏦 Principal</span>
                <span className={styles.breakdownVal}>{formatCurrency(Number(principal))}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownKey}>💸 Total Interest</span>
                <span className={styles.breakdownVal} style={{ color: 'var(--color-amber)' }}>
                  {formatCurrency(Math.round(totalInterest))}
                </span>
              </div>
              <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
                <span className={styles.breakdownKey}>💰 Total Payable</span>
                <span className={styles.breakdownVal} style={{ color: 'var(--color-primary-light)' }}>
                  {formatCurrency(Math.round(totalPayable))}
                </span>
              </div>
            </div>

            {/* Visual donut-style ratio bar */}
            <div className={styles.ratioSection}>
              <div className={styles.ratioBar} aria-label="Loan breakdown ratio">
                <div
                  className={styles.ratioSegmentP}
                  style={{ width: `${principalPct}%` }}
                  title={`Principal: ${principalPct.toFixed(1)}%`}
                />
                <div
                  className={styles.ratioSegmentI}
                  style={{ width: `${interestPct}%` }}
                  title={`Interest: ${interestPct.toFixed(1)}%`}
                />
              </div>
              <div className={styles.ratioLegend}>
                <span className={styles.legendP}>
                  <span className={styles.legendDot} />
                  Principal ({principalPct.toFixed(1)}%)
                </span>
                <span className={styles.legendI}>
                  <span className={styles.legendDot} />
                  Interest ({interestPct.toFixed(1)}%)
                </span>
              </div>
            </div>

            <p className={styles.formula}>
              Formula: EMI = [P × r × (1+r)^n] / [(1+r)^n − 1] &nbsp;|&nbsp; r = {rate}% ÷ 12 ÷ 100
            </p>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon} aria-hidden="true">📐</span>
            <p>Fill in all fields to calculate your EMI</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default EMICalculator;
