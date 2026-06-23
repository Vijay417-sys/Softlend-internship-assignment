# 💳 Softlend — Credit Health & Loan Marketplace Dashboard

A responsive React frontend application for the **Softlend** fintech platform. It lets users view their CIBIL credit score, explore personalised loan offers, simulate score improvements, and calculate EMIs — all powered by a static JSON data source with no backend required.

---

## 🚀 Live Preview

```
npm start   →   http://localhost:3000
```

---

## ✨ Features

### 📊 Credit Dashboard
- **Animated CIBIL Score Ring** — SVG arc that draws itself in with a smooth transition; color-coded red / amber / green based on score range
- **Potential Score Card** — shows current vs. potential score with a dual-layer progress bar
- **Credit Improvement Plan** — lists all score factors (high / medium / low impact) with actionable advice and estimated point gains
- **Score Simulator** — interactive "what-if" tool to preview score after fixing specific factors

### 💰 Loan Offers
- **Unlocked / Locked offer cards** — dynamically determined by comparing `min_score_required` against the user's live CIBIL score
- **Debounced search** (300 ms) — filter offers by lender name without unnecessary re-renders
- **Filter tabs** — All / Unlocked / Locked with animated indicator
- **Empty states** — distinct messages for "no search results" vs "no unlocked offers"
- **Confirmation Modal** — shows full loan summary before accepting
- **Success Popup** — animated ✅ checkmark + confetti burst + offer summary card, auto-dismisses after 5 seconds

### 🧮 EMI Calculator
- **Default values pre-filled** — ₹5,00,000 principal · 10.5% rate · 36 months tenure
- **Interactive sliders** with live fill gradient — drag to update any field instantly
- **Quick loan presets** — Home Loan / Car Loan / Personal Loan / Education Loan
- **Live result panel** — Monthly EMI, total interest, total payable, and principal/interest ratio bar with percentage labels
- **Manual text inputs** — override any slider value by typing directly
- **Reset to defaults** button

### 🌗 Day / Night Mode
- Toggle in the header with an animated pill-style switch (☀️ / 🌙)
- **Night mode** — clean deep dark navy (`#0f1219` base) — easy on the eyes
- **Day mode** — bright white with indigo accents
- Theme persisted in `localStorage` — survives page refresh
- Smooth CSS variable transitions on **all** elements (no flash)

---

## 🗂️ Project Structure

```
softlend/
├── public/
│   └── data.json                  # Static data source (customer + offers + score factors)
├── src/
│   ├── index.css                  # Global reset, CSS variables (day/night), animations
│   ├── App.js                     # Root — theme state, tab routing, data fetch
│   ├── App.module.css             # Header, nav, footer, theme toggle styles
│   ├── utils.js                   # formatCurrency · formatDate · calculateEMI · getScoreCategory
│   ├── data.json                  # (dev copy) Static mock data
│   └── components/
│       ├── CreditDashboard/       # Score overview, improvement plan, score simulator
│       ├── ScoreRing/             # Animated SVG arc gauge
│       ├── ScoreFactorCard/       # Individual credit factor card
│       ├── ScoreSimulator/        # What-if score improvement simulator
│       ├── LoanOffers/            # Offer list with filter + search
│       ├── OfferCard/             # Individual loan offer card (locked / unlocked)
│       ├── ConfirmationModal/     # Confirm before accepting an offer
│       ├── SuccessPopup/          # ✅ Post-acceptance animated success popup
│       ├── EMICalculator/         # Interactive EMI tool with sliders & presets
│       ├── LoadingSpinner/        # Loading state UI
│       └── ErrorMessage/          # Error state with retry button
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 (functional components + hooks) |
| Styling | CSS Modules + CSS Custom Properties (variables) |
| State Management | `useState`, `useEffect`, `useMemo` |
| Data Source | Static `data.json` fetched via `fetch()` |
| Type Checking | PropTypes |
| Build Tool | Create React App (react-scripts 5) |
| Fonts | Inter (Google Fonts) |

---

## 📐 Key Implementation Details

### Theme System
Two complete CSS variable sets (`[data-theme="night"]` and `[data-theme="day"]`) are defined in `index.css`. Switching themes sets `document.documentElement.setAttribute('data-theme', theme)` — all CSS variables cascade instantly. A `transition` on `background-color`, `border-color`, and `color` on every element produces a smooth animated theme switch.

### Data Fetching
`App.js` uses an `AbortController` to safely cancel in-flight requests on unmount. A small 800 ms artificial delay showcases the loading spinner. Errors are caught and surfaced via the `ErrorMessage` component with a retry callback.

### EMI Formula
```
EMI = [P × r × (1+r)^n] / [(1+r)^n − 1]
```
Where `r = annualRate / 12 / 100`. Computed with `useMemo` so it only recalculates when inputs change.

### Debounced Search
A `useEffect` with a 300 ms `setTimeout` (cleared on cleanup) converts the raw `searchTerm` state into `debouncedSearch`, preventing expensive filter passes on every keystroke.

### Offer Lock Logic
```js
const isUnlocked = offer.min_score_required <= cibilScore;
```
A simple comparison drives the entire locked/unlocked UI split — badge, card style, accept button visibility, and filter tab counts.

### Score Simulator
Builds a "what-if" state where users tick off credit factors one by one. Each checked factor adds its `estimated_score_gain` to the current score (capped at 900) and shows which loan offers would become unlocked.

---

## 📦 Static Data Shape

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

## 🛠️ Getting Started

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Installation

```bash
# Clone or unzip the project
cd softlend

# Install dependencies
npm install

# Start the development server
npm start
```

The app opens at **http://localhost:3000**.

### Build for Production

```bash
npm run build
```

Output is in the `build/` directory — ready to deploy on any static host (Netlify, Vercel, GitHub Pages, etc.).

---

## 📱 Responsive Design

| Breakpoint | Behaviour |
|---|---|
| `> 900px` | Two-column layout (form + result side by side in EMI Calculator) |
| `768px` | Single-column, compact nav tabs, hidden theme label |
| `480px` | Compact preset buttons, smaller inputs |

---

## 🎨 Design Tokens (CSS Variables)

| Variable | Night | Day |
|---|---|---|
| `--bg-base` | `#0f1219` | `#f5f5ff` |
| `--bg-card` | `#1e2638` | `#ffffff` |
| `--color-primary` | `#6366f1` | `#4f46e5` |
| `--color-green` | `#10b981` | `#059669` |
| `--color-amber` | `#f59e0b` | `#d97706` |
| `--text-primary` | `#e8eaf0` | `#1a1a3a` |

---

## 🧑‍💻 Author

Built as a frontend assignment demonstrating React architecture, CSS Modules theming, interactive UI components, and clean data-driven design.
