#  Macro Rides — Zone Boundary & Dynamic Route Corridor Visualizer

A production-quality web application built for the Macro Rides Technical Evaluation Assignment. It visualizes a live driver route, draws a **350m buffer corridor** using Turf.js, indexes pickup points with **H3 (Res-9)**, and highlights eligible pickups in real time as the driver moves.

---

##  Live Demo

Open **`index-standalone.html`** directly in any modern browser — no build step required.

---

##  Features

| Feature | Implementation |
|---|---|
| 350m Route Buffer | `@turf/buffer` (geodesic, 20-step polygon) |
| Spatial Indexing | H3 `latLngToCell` + `polygonToCells` at Resolution 9 |
| Real-time Eligibility | H3 cell set intersection on every driver tick |
| Map Rendering | Leaflet 1.9 with CartoDB dark/light tiles |
| Route Animation | Interval-driven simulation with 4 speed settings |
| Zone Boundaries | Operational / Premium / Restricted polygons |
| Statistics Sidebar | Live eligible count, coverage %, rider count, corridor area |
| Dark / Light Mode | Full CSS custom property theming |
| Pickup Info Panel | Click any marker for H3 cell, distance, waiting riders |
| Driver Marker | SVG arrow that rotates with bearing |

---

##  How It Works

```
Driver moves along route
         │
         ▼
turf.buffer(traveledRoute, 350m)
         │  Creates a geodesic polygon
         ▼
h3.polygonToCells(bufferPolygon, resolution=9)
         │  Returns all H3 cells inside the corridor
         ▼
For each pickup point:
  h3.latLngToCell(lat, lng, resolution=9)
         │
         ▼
  cell ∈ corridorCells?  →  eligible = true
```

**Why H3 Resolution 9?**
At Res-9, each hexagon has an edge length of ~174m and area of ~0.105 km². This gives sub-350m precision — a point at the edge of one hex is guaranteed to be within 350m of the corridor boundary. Using hexagons avoids the edge-case misses that occur with square grid cells.

---

##  Project Structure

```
macro-rides/
├── index-standalone.html    ← Main deliverable (open directly in browser)
│
├── src/                     ← React + TypeScript source (requires Node.js)
│   ├── types/index.ts       ← TypeScript interfaces
│   ├── data/sampleData.ts   ← Route, pickup points, zone polygons
│   ├── utils/geo.ts         ← H3 + Turf spatial utilities
│   ├── hooks/
│   │   ├── useSimulation.ts ← Route playback state machine
│   │   └── useCorridor.ts   ← H3 corridor + eligibility memoization
│   ├── components/
│   │   ├── MapView.tsx      ← react-leaflet map with all layers
│   │   ├── DriverMarker.tsx ← Directional SVG driver icon
│   │   ├── StatsSidebar.tsx ← Live stats + pickup list
│   │   └── ControlsBar.tsx  ← Playback controls + speed
│   ├── styles/app.css       ← Full dark/light theme CSS
│   ├── App.tsx              ← Root component
│   └── main.tsx             ← Entry point
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

##  Running the React App

```bash
# Install dependencies
npm install

# Development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
# → dist/

# Preview production build
npm run preview
```

**Requirements:** Node.js ≥ 18, npm ≥ 9

**Stack:**
- React 18 + TypeScript
- Vite 6
- Leaflet + react-leaflet
- H3-js 4.x
- @turf/turf 7.x

---

##  Deployment

### Vercel (recommended)
```bash
npx vercel
# or push to GitHub and import at vercel.com
```

### Netlify
```bash
npm run build
# Drag & drop the dist/ folder at netlify.com/drop
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ to gh-pages branch
```

### Static (no build)
Upload `index-standalone.html` to any static host. It loads all dependencies from CDN.

---

##  Sample Data

The demo simulates a real Bengaluru route:

**Route:** Koramangala 5th Block → Indiranagar 12th Main (~3.8 km)

**20 pickup points** across 4 types:
-  Metro stations (Indiranagar Metro, JP Nagar Metro)
-  Bus stops (Sony World Signal, Domlur Flyover, etc.)
-  Landmarks (Forum Mall, Embassy Golf Links)
-  Residential gates (HSR Sector 1, Domlur Layout)

**4 zone polygons:**
- Koramangala Ops Zone (operational)
- HSR–Domlur Corridor (premium)
- Indiranagar Zone (operational)
- Restricted Zone

---

##  Architecture Notes

- **Spatial indexing**: H3 Res-9 cells are re-computed on each tick using `polygonToCells`. A `Set` lookup makes eligibility O(1) per pickup.
- **Buffer accuracy**: Turf uses geodesic calculations — the 350m radius is accurate in meters, not degrees.
- **Performance**: `useMemo` (React build) / lazy recalculation ensures the corridor polygon is only rebuilt when the route changes, not on every render.
- **Scalability**: The architecture supports swapping real-time GPS via WebSocket — replace the simulation interval with a WS message handler calling the same `update()` function.




