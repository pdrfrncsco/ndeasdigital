# NDEIAS Frontend (Next.js)

This folder contains a simple Next.js scaffold that reuses the existing static HTML/CSS from the `arquivos` folder to quickly reproduce the current site in a React/Next environment.

Quick start (requires Node.js >= 18):

```powershell
cd arquivos\frontend
npm install
npm run dev
```

Notes:
- The page currently injects the original HTML body via `dangerouslySetInnerHTML` for a fast port. We can incrementally convert sections to proper React components.
- External libraries (Tailwind via CDN, Font Awesome, jspdf, html2canvas) are included in `_app.js`.
- Next step: split the large HTML into React components and connect to a Django API backend.
