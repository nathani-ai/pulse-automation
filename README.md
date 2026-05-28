# Pulse Automation — Landing Page

Production-grade single-page landing site for Pulse Automation, an AI automation agency for healthcare and dental practices. Built with Vite, React 18, and Tailwind CSS.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 (Vite will open it for you).

## Build

```bash
npm run build      # outputs to ./dist
npm run preview    # serve the built bundle locally
```

## Stack

- **Vite** 5 (dev server + bundler)
- **React** 18
- **Tailwind CSS** 3 (utility classes only — color tokens and animations are inline in the component)
- **lucide-react** for iconography
- **Google Fonts**: Instrument Serif (display) + DM Sans (body), loaded inside the component

## Project layout

```
.
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # React entry
    ├── PulseAutomation.jsx   # the entire landing page
    └── index.css             # Tailwind base + reset
```

Everything lives in one component — `src/PulseAutomation.jsx` — so you can drop it into another project by copying that one file and installing `lucide-react`.

## Customizing

- **Accent color**: change `C.accent` (currently electric amber `#FFB628`) at the top of `PulseAutomation.jsx`.
- **Fonts**: swap the Google Fonts import inside the `GlobalStyles` component and update `F.display` / `F.body`.
- **Copy**: every string is in plain text in `PulseAutomation.jsx` — find and replace.
