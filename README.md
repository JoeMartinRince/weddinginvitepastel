# Aju & Naaji — Luxury Digital Wedding Invitation Website

An editorial digital wedding invitation website crafted for **Aju & Naaji**, inspired by high-end botanical wedding stationery, luxury printed cards, and contemporary motion design.

---

## 🌸 Overview & Creative Direction

Designed around a warm pastel botanical aesthetic:
- **Warm Ivory (`#F8F7F1`)**: Soft, tactile fine paper backdrop with subtle grain.
- **Pale Sage (`#DCE7D8` & `#EDF2E8`)**: Delicate botanical highlights and layered petal contours.
- **Muted Sage Green (`#8FA88D` & `#A8BDA7`)**: Foliage, vine flourishes, and organic borders.
- **Deep Forest Sage (`#70896F`)**: High-contrast typography, stem pathways, and leaf venation.
- **Antique Gold (`#B69A70`)**: Elegant monograms, flower cores, pollen stamens, and metallic accents.

---

## ✨ Key Features & Architecture

### 1. Interactive Botanical HoverBloom Engine
- Built with a custom HTML5 Canvas engine located in [`assets/js/hover-bloom.js`](file:///assets/js/hover-bloom.js).
- Integrates continuous spline growth physics, velocity-responsive stem curves, blooming petal expansion, and graceful life-cycle fading.
- Tailored exclusively to the wedding palette with warm ivory petals, pale sage secondary layers, and antique gold stamen cores.
- Delicate sage under-layer contours ensure ivory petals remain crisp and visible against ivory paper.

### 2. Ambient Falling Petals Particle Physics
- Continuous ambient drifting particles in [`assets/js/botanical-motion.js`](file:///assets/js/botanical-motion.js).
- Soft pastel green and ivory flower petals drifting with natural sway, air turbulence, and subtle 3D rotational wobble.

### 3. Scroll-Synchronized Botanical Growth
- Corner vines and floral flourishes that grow and unfurl organically via `IntersectionObserver` triggers.
- Multi-breakpoint responsive geometry adapting from mobile (`360px`, `390px`, `430px`) to tablet (`768px`) and desktop (`1024px`, `1440px`).

### 4. Architectural Arch Hero & Live Countdown
- Classic rounded arch silhouette inspired by heritage Mediterranean and Mughal architecture.
- Real-time countdown timer tracking the days, hours, minutes, and seconds until 02 January 2027.

### 5. Event Itineraries & Direct Navigation
- **Nikkah**: Saturday, 02 January 2027 (11:00 AM – 3:00 PM) at Royal Alliance Auditorium, Feroke, Kozhikode.
- **Reception**: Sunday, 03 January 2027 (11:30 AM – 8:00 PM) at Groom's Residence, Chalad, Kannur.
- Direct Google Maps links for one-tap driving directions.

### 6. Editorial Typography & Layout
- **Headings**: Cormorant Garamond
- **Accent & Script Details**: Pinyon Script
- **Body & Captions**: DM Sans

---

## 🚀 Running Locally

To preview the website locally:

```bash
# Start a local HTTP server
python -m http.server 8080
```

Open your browser and navigate to:
`http://localhost:8080/index.html`

---

## ⚡ Deployment on Vercel

The website is fully optimized for one-click deployment to **Vercel**:

### Option 1: Import via Vercel Dashboard (Recommended)
1. Go to [Vercel New Project](https://vercel.com/new).
2. Connect your GitHub account and import `JoeMartinRince/weddinginvitepastel`.
3. Vercel automatically detects [`vercel.json`](vercel.json) and configures the static deployment.
4. Click **Deploy**. Your custom wedding invitation will be live on a global CDN within seconds!

### Option 2: Deploy via Vercel CLI
```bash
npx vercel
```

### Vercel Optimizations Included:
- **[`vercel.json`](vercel.json)**: Configures clean URLs, automatic `.mjs` ES Module MIME types (`application/javascript`), Service Worker scope authorization (`Service-Worker-Allowed: /`), and immutable CDN caching headers (`max-age=31536000`) for all assets.
- **[`.vercelignore`](.vercelignore)**: Keeps the production deployment bundle ultra-lean (<15MB) by excluding local QA screenshots and automated test scripts while preserving all client assets.
- **[`package.json`](package.json)**: Provides standard scripts for building and QA testing.

---

## 🧪 Testing & Verification

The repository includes comprehensive automated QA suites powered by Chrome DevTools Protocol (CDP):

```bash
# Run quality assurance content & asset checks (0 console errors, 0 template leaks)
node qa_verify.js

# Run full navigation drawer & smooth-scroll anchor tests
node test_nav_full.js

# Test HoverBloom canvas interaction and capture multi-device screenshots
node test_hover_bloom.js
```

---

## 📁 Repository Structure

```
├── assets/
│   ├── botanical/              # Generated botanical SVG path assets
│   ├── css/                    # Botanical motion & stacking stylesheets
│   ├── js/                     # HoverBloom engine & botanical motion controller
│   └── framerusercontent.com/  # Framer runtime modules, fonts & background textures
├── index.html                  # Production wedding website
├── generate_index.js           # Automated index markup generator
├── qa_verify.js                # Core QA validation suite
└── test_hover_bloom.js         # Interactive canvas verification script
```
