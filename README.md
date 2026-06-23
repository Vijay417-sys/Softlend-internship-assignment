# 💳 Softlend — Credit Health & Loan Marketplace Dashboard

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://softlend-internship-assignment-sgsh.vercel.app/)
[![Portfolio](https://img.shields.io/badge/👤%20Portfolio-Vijay-6366f1?style=for-the-badge)](https://vijay-portfolio-lemon.vercel.app/)
[![GitHub](https://img.shields.io/badge/📦%20GitHub-Repository-24292e?style=for-the-badge&logo=github)](https://github.com/Vijay417-sys/Softlend-internship-assignment)

**A fully responsive React fintech dashboard — credit score visualization, loan marketplace, EMI calculator, and day/night theming.**

[🌐 Live App](https://softlend-internship-assignment-sgsh.vercel.app/) &nbsp;·&nbsp; [👤 Portfolio](https://vijay-portfolio-lemon.vercel.app/) &nbsp;·&nbsp; [📦 Source Code](https://github.com/Vijay417-sys/Softlend-internship-assignment)

</div>

---

## 🖥️ Live Preview

| 🌞 Day Mode | 🌙 Night Mode |
|---|---|
| Clean white UI with indigo accents | Deep navy dark theme |

> **Hosted on Vercel:** https://softlend-internship-assignment-sgsh.vercel.app/

---

## ✨ Features

### 📊 Credit Dashboard
- **Animated CIBIL Score Ring** — SVG arc animates itself in on load; color-coded **red** (< 650) / **amber** (650–749) / **green** (750+)
- **Potential Score Card** — dual-layer progress bar comparing current vs. potential score after fixing high-impact items
- **Credit Improvement Plan** — actionable factor cards (HIGH / MEDIUM / LOW impact) with estimated point gains and specific fix instructions
- **Score Simulator** — interactive "what-if" tool: check off credit factors and see your score update in real time, plus which loan offers unlock

### 💰 Loan Offers
- **Unlocked / Locked Cards** — dynamically computed by comparing `min_score_required` vs user's live CIBIL score
- **Debounced Search** — 300 ms debounce on lender name search; no re-renders on every keystroke
- **Filter Tabs** — All / ✓ Unlocked / 🔒 Locked with smooth animated underline indicator
- **Empty States** — contextual messages for "no results" vs "no unlocked offers"
- **Confirmation Modal** — full offer summary before accepting (amount, rate, tenure, EMI, fee)
- **✅ Success Popup** — animated SVG checkmark, 8-directional confetti burst, offer summary card, and auto-dismiss progress bar after 5 seconds

### 🧮 EMI Calculator
- **Pre-filled Defaults** — opens with ₹5,00,000 · 10.5% · 36 months already calculated
- **Interactive Sliders** — draggable range sliders with live gradient fill; result updates instantly
- **Manual Text Inputs** — override any slider value by typing
- **Quick Loan Presets** — one-click fill for Home Loan / Car Loan / Personal Loan / Education Loan
- **Live Result Panel** — Monthly EMI, Total Interest, Total Payable, principal/interest ratio bar with % labels
- **Reset to Defaults** button

### 🌗 Day / Night Theme
- **Animated toggle** in the header (☀️ / 🌙 pill switch)
- **Day mode** (default) — clean white with indigo accents
- **Night mode** — deep navy dark (`#0f1219` base) — minimal eye strain
- **`localStorage` persistence** — theme survives page refresh
- **Smooth transitions** — CSS variable changes on every element via `transition: background-color, color, border-color`

---

## 🗂️ Project Structure

```
softlend/
├── public/
│   ├── index.html
│   └── data.json                        # Static API mock (customer + offers + score factors)
│
├── src/
│   ├── index.js                         # React entry point
│   ├── index.css                        # Global reset, CSS variables (day/night tokens), animations
│   ├── App.js                           # Root — theme state, tab routing, async data fetch
│   ├── App.module.css                   # Header, nav, theme toggle, footer styles
│   ├── utils.js                         # formatCurrency · formatDate · calculateEMI · getScoreCategory
│   ├── data.json                        # (dev) same mock data
│   │
│   └── components/
│       ├── CreditDashboard/             # Score overview, improvement plan, score simulator
│       │   ├── CreditDashboard.js
│       │   └── CreditDashboard.module.css
│       │
│       ├── ScoreRing/                   # Animated SVG arc gauge
│       │   ├── ScoreRing.js
│       │   └── ScoreRing.module.css
│       │
│       ├── ScoreFactorCard/             # Individual credit factor card (impact badge + action text)
│       │   ├── ScoreFactorCard.js
│       │   └── ScoreFactorCard.module.css
│       │
│       ├── ScoreSimulator/              # What-if score simulator with checkbox factors
│       │   ├── ScoreSimulator.js
│       │   └── ScoreSimulator.module.css
│       │
│       ├── LoanOffers/                  # Offer list — filter tabs, debounced search, grid
│       │   ├── LoanOffers.js
│       │   └── LoanOffers.module.css
│       │
│       ├── OfferCard/                   # Individual offer card (locked / unlocked state)
│       │   ├── OfferCard.js
│       │   └── OfferCard.module.css
│       │
│       ├── ConfirmationModal/           # Pre-acceptance confirmation dialog
│       │   ├── ConfirmationModal.js
│       │   └── ConfirmationModal.module.css
│       │
│       ├── SuccessPopup/                # Post-acceptance animated success popup
│       │   ├── SuccessPopup.js
│       │   └── SuccessPopup.module.css
│       │
│       ├── EMICalculator/               # Interactive EMI tool with sliders & presets
│       │   ├── EMICalculator.js
│       │   └── EMICalculator.module.css
│       │
│       ├── LoadingSpinner/              # Loading state UI
│       │   ├── LoadingSpinner.js
│       │   └── LoadingSpinner.module.css
│       │
│       └── ErrorMessage/               # Error state with retry button
│           ├── ErrorMessage.js
│           └── ErrorMessage.module.css
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🔧 Tech Stack

| Category | Technology |
|---|---|
| **UI Framework** | React 18 — functional components + hooks |
| **Styling** | CSS Modules + CSS Custom Properties (variables) |
| **State** | `useState`, `useEffect`, `useMemo` — no external state lib |
| **Data** | Static `data.json` fetched with native `fetch()` |
| **Type Checking** | PropTypes |
| **Build Tool** | Create React App (react-scripts 5) |
| **Deployment** | Vercel |
| **Fonts** | Inter (Google Fonts) |

---

## 📐 Key Implementation Details

### Theme System
Two complete CSS variable sets defined in `index.css`:
- `:root, [data-theme="night"]` — navy dark palette
- `[data-theme="day"]` — white/indigo light palette

`App.js` calls `document.documentElement.setAttribute('data-theme', theme)` on every theme change. A global `transition` rule on `*` makes every color change animate smoothly.

```js
// Persisted in localStorage, day mode by default
const [theme, setTheme] = useState(() =>
  localStorage.getItem('softlend-theme') || 'day'
);
```

### Data Fetching
Uses `AbortController` to cancel in-flight requests on unmount. An 800 ms artificial delay demonstrates the loading spinner:

```js
const controller = new AbortController();
const response = await fetch('/data.json', { signal: controller.signal });
return () => controller.abort(); // cleanup
```

### EMI Formula
```
EMI = [P × r × (1+r)^n] / [(1+r)^n − 1]
```
Where `r = annualRate ÷ 12 ÷ 100`. Wrapped in `useMemo` — only recalculates on input changes.

### Debounced Search
```js
useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
  return () => clearTimeout(timer); // cancel on each keystroke
}, [searchTerm]);
```

### Offer Lock Logic
```js
const isUnlocked = offer.min_score_required <= cibilScore;
```
Drives badge, card style, button visibility, and filter tab counts — all from one comparison.

### Score Simulator
Tracks a `Set` of checked factor IDs. Gain = sum of `estimated_score_gain` for all checked factors (capped at 900). Highlights which locked loan offers would newly unlock.

---

## 📦 Data Schema (`public/data.json`)

```json
{
  "customer": {
    "id": "C001",
    "name": "Ravi Kumar",
    "cibil_score": 620,
    "score_updated_at": "2024-01-10"
  },
  "score_factors": [
    {
      "factor": "Credit utilisation",
      "current_value": "87%",
      "ideal_value": "below 30%",
      "impact": "high",
      "estimated_score_gain": 35,
      "action": "Pay down your HDFC credit card from ₹43,500 to below ₹15,000"
    },
    {
      "factor": "Missed EMI",
      "current_value": "2 missed in 2023",
      "ideal_value": "0 missed",
      "impact": "high",
      "estimated_score_gain": 25,
      "action": "Clear overdue amount of ₹4,200 on Bajaj Finserv loan"
    },
    {
      "factor": "Credit age",
      "current_value": "1.2 years",
      "ideal_value": "3+ years",
      "impact": "medium",
      "estimated_score_gain": 10,
      "action": "Avoid closing your oldest credit card — let it age"
    }
  ],
  "loan_offers": [
    {
      "id": "OFF001",
      "lender": "HDFC Bank",
      "amount": 500000,
      "interest_rate": 10.5,
      "tenure_months": 36,
      "processing_fee": 2500,
      "status": "active",
      "emi": 16253,
      "min_score_required": 700
    }
  ]
}
```

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Vijay417-sys/Softlend-internship-assignment.git
cd Softlend-internship-assignment

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# Opens at http://localhost:3000
```

### Build for Production

```bash
npm run build
# Output in /build — deploy to any static host
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 900px` | Two-column layout in EMI Calculator (form + result side by side) |
| `≤ 768px` | Single-column layout, compact nav tabs, theme label hidden |
| `≤ 480px` | Compact preset buttons, smaller inputs, tighter spacing |

---

## 🎨 Design Tokens

| CSS Variable | ☀️ Day | 🌙 Night |
|---|---|---|
| `--bg-base` | `#f5f5ff` | `#0f1219` |
| `--bg-surface` | `#ffffff` | `#161c28` |
| `--bg-card` | `#ffffff` | `#1e2638` |
| `--bg-elevated` | `#f0f0fa` | `#2b3650` |
| `--color-primary` | `#4f46e5` | `#6366f1` |
| `--color-green` | `#059669` | `#10b981` |
| `--color-amber` | `#d97706` | `#f59e0b` |
| `--text-primary` | `#1a1a3a` | `#e8eaf0` |
| `--text-muted` | `#8080b0` | `#5a6880` |

---

## 👤 Author

**Vijay Hosapeti**

- 🌐 Portfolio: [vijay-portfolio-lemon.vercel.app](https://vijay-portfolio-lemon.vercel.app/)
- 💼 GitHub: [github.com/Vijay417-sys](https://github.com/Vijay417-sys)

---

<div align="center">

Built with ❤️ as a frontend internship assignment for **Softlend Fintech**

© 2024 — Credit data is simulated for demo purposes only.

</div>
