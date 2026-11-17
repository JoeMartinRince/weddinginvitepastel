const fs = require('fs');

const fontFaceCss = fs.readFileSync('extracted_fonts.css', 'utf8');

const htmlContent = `<!doctype html>
<!-- Made in Framer — framer.com -->
<html dir="ltr" lang="en">
<head>
    <meta charset="utf-8">
    <script>(function(){var p=location.pathname;if(p.endsWith("/index.html")){history.replaceState(null,"",p.slice(0,-10))}})()</script>
    <script>(function(){document.addEventListener("click",function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(!a)return;if(a.target&&a.target!=="_self")return;if(a.hasAttribute("download"))return;var href=a.getAttribute("href")||"";if(href.charAt(0)==="#")return;var u;try{u=new URL(a.href,location.href)}catch(err){return}if(u.origin!==location.origin)return;if(u.pathname===location.pathname&&u.hash)return;e.preventDefault();e.stopPropagation();location.assign(u.href)},true)})()</script>
    
    <title>Aju &amp; Naaji — 02 January 2027</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Together with our families, we joyfully invite you to celebrate the wedding of Aju &amp; Naji.">
    <link rel="icon" href="assets/monogram.svg" type="image/svg+xml">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Aju &amp; Naaji — 02 January 2027">
    <meta property="og:description" content="Together with our families, we joyfully invite you to celebrate the wedding of Aju &amp; Naji.">
    <meta property="og:image" content="assets/a_clean_elegant_wedding_invitation_website_hero_in.png">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Aju &amp; Naaji — 02 January 2027">
    <meta name="twitter:description" content="Together with our families, we joyfully invite you to celebrate the wedding of Aju &amp; Naji.">
    <meta name="twitter:image" content="assets/a_clean_elegant_wedding_invitation_website_hero_in.png">

    <!-- Fonts: Local WOFF2 + Google Fonts fallback -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Pinyon+Script&display=swap" rel="stylesheet">

    <!-- Botanical Motion CSS -->
    <link rel="stylesheet" href="assets/css/botanical-motion.css">

    <style data-framer-font-css>
\${fontFaceCss}
    </style>

    <style id="custom-invitation-styles">
      :root {
        --ivory: #F8F7F1;
        --sage-pale: #EDF2E8;
        --sage-soft: #C9D8C6;
        --sage-muted: #8FA88D;
        --forest-deep: #344C3B;
        --antique-gold: #B69A70;
        --antique-gold-light: rgba(182, 154, 112, 0.28);
        --text-dark: #344C3B;
        --text-muted: #5F6A6A;
        --font-serif: 'Cormorant Garamond', Georgia, serif;
        --font-sans: 'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        --font-script: 'Pinyon Script', cursive;
        --font-mono: 'PT Mono', monospace;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        scroll-behavior: smooth;
        background-color: var(--ivory);
        color: var(--forest-deep);
        font-family: var(--font-sans);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        background-color: var(--ivory);
        background-image: 
          radial-gradient(circle at 10% 12%, rgba(201, 216, 198, 0.35) 0%, transparent 45%),
          radial-gradient(circle at 90% 88%, rgba(201, 216, 198, 0.3) 0%, transparent 45%),
          radial-gradient(circle at 85% 15%, rgba(237, 242, 232, 0.45) 0%, transparent 35%),
          url('assets/paper_texture.jpg');
        background-repeat: repeat;
        color: var(--forest-deep);
        overflow-x: hidden;
        min-height: 100vh;
        line-height: 1.6;
      }

      /* Scroll margin for sticky nav */
      section, [id] {
        scroll-margin-top: 84px;
      }

      /* ==================== 1. NAVIGATION ==================== */
      .site-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        height: 74px;
        transition: all 0.3s ease;
        background: rgba(248, 247, 241, 0.92);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid rgba(182, 154, 112, 0.22);
        box-shadow: 0 4px 20px rgba(52, 76, 59, 0.03);
      }

      .site-header.nav-scrolled {
        background: rgba(248, 247, 241, 0.98);
        box-shadow: 0 6px 24px rgba(52, 76, 59, 0.07);
      }

      .nav-container {
        max-width: 1280px;
        height: 100%;
        margin: 0 auto;
        padding: 0 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .nav-brand {
        display: flex;
        align-items: center;
        text-decoration: none;
        z-index: 10001;
      }

      .nav-brand img {
        height: 44px;
        width: auto;
        display: block;
        transition: transform 0.3s ease;
      }

      .nav-brand:hover img {
        transform: scale(1.04);
      }

      .nav-links-desktop {
        display: flex;
        align-items: center;
        gap: 32px;
        list-style: none;
      }

      .nav-links-desktop a {
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--forest-deep);
        text-decoration: none;
        position: relative;
        padding: 6px 0;
        transition: color 0.25s ease;
      }

      .nav-links-desktop a::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0%;
        height: 1px;
        background-color: var(--antique-gold);
        transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .nav-links-desktop a:hover {
        color: var(--antique-gold);
      }

      .nav-links-desktop a:hover::after {
        width: 100%;
      }

      /* Mobile Hamburger Button */
      .nav-toggle-btn {
        display: none;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 10px;
        z-index: 10001;
        color: var(--forest-deep);
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }

      .nav-toggle-btn:focus-visible {
        outline: 2px solid var(--antique-gold);
      }

      .nav-toggle-btn svg {
        width: 26px;
        height: 26px;
        stroke: var(--forest-deep);
        stroke-width: 2;
        display: block;
      }

      /* Mobile Drawer */
      .mobile-menu-drawer {
        position: fixed;
        inset: 0;
        background: rgba(248, 247, 241, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        transform: translateY(-8px);
      }

      .mobile-menu-drawer.is-open {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }

      .drawer-close-btn {
        position: absolute;
        top: 20px;
        right: 24px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--forest-deep);
        padding: 12px;
        border-radius: 50%;
        transition: background-color 0.2s;
      }

      .drawer-close-btn:hover {
        background-color: rgba(182, 154, 112, 0.15);
      }

      .drawer-close-btn svg {
        width: 28px;
        height: 28px;
        stroke: var(--forest-deep);
        stroke-width: 2;
        display: block;
      }

      .mobile-menu-drawer .drawer-brand {
        margin-bottom: 32px;
      }

      .mobile-menu-drawer ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 22px;
        text-align: center;
      }

      .mobile-menu-drawer a {
        font-family: var(--font-serif);
        font-size: 24px;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--forest-deep);
        text-decoration: none;
        padding: 6px 12px;
        transition: color 0.2s ease, transform 0.2s ease;
        display: inline-block;
      }

      .mobile-menu-drawer a:hover,
      .mobile-menu-drawer a:active {
        color: var(--antique-gold);
        transform: scale(1.05);
      }

      .mobile-menu-drawer .drawer-footer {
        margin-top: 40px;
        font-family: var(--font-sans);
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--sage-muted);
      }

      /* ==================== 2. HERO SECTION ==================== */
      .hero-section {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 110px 24px 60px 24px;
        overflow: hidden;
      }

      .hero-bg-accent {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background: 
          radial-gradient(ellipse at 50% 15%, rgba(201, 216, 198, 0.4) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 90%, rgba(237, 242, 232, 0.5) 0%, transparent 70%);
      }

      .botanical-corner {
        position: absolute;
        pointer-events: none;
        z-index: 0;
        user-select: none;
        opacity: 0.92;
        filter: drop-shadow(0 8px 16px rgba(52, 76, 59, 0.06));
      }

      .botanical-tl {
        top: 20px;
        left: -10px;
        width: 380px;
        max-width: 42vw;
      }

      .botanical-br {
        bottom: 10px;
        right: -10px;
        width: 360px;
        max-width: 40vw;
      }

      /* Centered Ornamental Arch Card */
      .hero-arch-card {
        position: relative;
        z-index: 5;
        width: 100%;
        max-width: 620px;
        background: #FDFCF9;
        border-radius: 300px 300px 24px 24px;
        border: 1px solid var(--antique-gold);
        box-shadow: 
          0 0 0 5px rgba(201, 216, 198, 0.35),
          0 20px 50px rgba(52, 76, 59, 0.08),
          0 2px 8px rgba(182, 154, 112, 0.12);
        padding: 70px 48px 52px 48px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .hero-arch-inner-border {
        position: absolute;
        inset: 8px;
        border-radius: 290px 290px 18px 18px;
        border: 1px dashed rgba(182, 154, 112, 0.5);
        pointer-events: none;
      }

      .hero-emblem {
        margin-bottom: 22px;
        animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
      }

      .hero-emblem img {
        width: 96px;
        height: auto;
        display: block;
        margin: 0 auto;
        filter: drop-shadow(0 2px 6px rgba(182, 154, 112, 0.2));
      }

      .hero-subtitle {
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: var(--forest-deep);
        margin-bottom: 16px;
        animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
      }

      .hero-names-wrap {
        margin: 8px 0 20px 0;
        animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
      }

      .hero-names {
        font-family: var(--font-serif);
        font-size: clamp(34px, 5.8vw, 56px);
        font-weight: 500;
        line-height: 1.15;
        letter-spacing: 2px;
        color: var(--forest-deep);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px 14px;
      }

      .hero-weds {
        font-family: var(--font-script);
        font-size: clamp(28px, 4.5vw, 44px);
        color: var(--antique-gold);
        font-weight: 400;
        letter-spacing: 0;
        text-transform: none;
        padding: 0 4px;
      }

      .hero-date-badge {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 10px 22px;
        border-top: 1px solid var(--antique-gold-light);
        border-bottom: 1px solid var(--antique-gold-light);
        margin-bottom: 16px;
        animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
      }

      .hero-date-text {
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--forest-deep);
      }

      .hero-dot {
        color: var(--antique-gold);
        font-size: 12px;
      }

      .hero-location {
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 3.5px;
        text-transform: uppercase;
        color: var(--sage-muted);
        margin-bottom: 22px;
        animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both;
      }

      .hero-hashtag {
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 3.5px;
        color: var(--antique-gold);
        margin-bottom: 26px;
        animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both;
      }

      .hero-scroll-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid var(--antique-gold-light);
        background: rgba(248, 247, 241, 0.8);
        color: var(--forest-deep);
        text-decoration: none;
        transition: all 0.25s ease;
        animation: floatSlow 2.6s ease-in-out infinite, heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both;
      }

      .hero-scroll-btn:hover {
        background: var(--forest-deep);
        color: var(--ivory);
        border-color: var(--forest-deep);
        transform: translateY(2px);
      }

      .hero-scroll-btn svg {
        width: 18px;
        height: 18px;
      }

      /* ==================== COMMON SECTION LAYOUT ==================== */
      .content-section {
        position: relative;
        padding: 90px 24px;
        max-width: 1240px;
        margin: 0 auto;
        z-index: 10;
      }

      .celebration-content-wrap {
        position: relative;
        z-index: 2;
        width: 100%;
      }

      .section-header {
        text-align: center;
        margin-bottom: 56px;
        position: relative;
      }

      .section-script-tag {
        font-family: var(--font-script);
        font-size: clamp(28px, 4vw, 36px);
        color: var(--antique-gold);
        margin-bottom: 6px;
        display: block;
      }

      .section-title {
        font-family: var(--font-serif);
        font-size: clamp(28px, 4vw, 42px);
        font-weight: 500;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--forest-deep);
        line-height: 1.25;
      }

      .section-subtitle {
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: var(--sage-muted);
        margin-top: 10px;
      }

      .section-divider-flower {
        width: 120px;
        height: auto;
        margin: 14px auto 0 auto;
        display: block;
        opacity: 0.85;
      }

      /* ==================== 3. INVITATION SECTION ==================== */
      .invitation-card-wrap {
        max-width: 820px;
        margin: 0 auto;
        position: relative;
      }

      .invitation-box {
        background: #FDFCF9;
        border: 1px solid var(--antique-gold);
        border-radius: 20px;
        padding: 68px 56px;
        position: relative;
        text-align: center;
        box-shadow: 
          0 0 0 6px rgba(201, 216, 198, 0.3),
          0 24px 60px rgba(52, 76, 59, 0.07);
      }

      .invitation-inner-border {
        position: absolute;
        inset: 10px;
        border-radius: 14px;
        border: 1px dashed rgba(182, 154, 112, 0.45);
        pointer-events: none;
      }

      .invitation-badge {
        width: 48px;
        height: auto;
        margin: 0 auto 16px auto;
        display: block;
      }

      .invitation-heading-script {
        font-family: var(--font-script);
        font-size: clamp(30px, 4vw, 40px);
        color: var(--antique-gold);
        margin-bottom: 22px;
      }

      .invitation-quote {
        font-family: var(--font-serif);
        font-size: clamp(17px, 2.3vw, 22px);
        line-height: 1.8;
        letter-spacing: 1.2px;
        color: var(--forest-deep);
        max-width: 680px;
        margin: 0 auto 28px auto;
        font-weight: 400;
        text-transform: uppercase;
      }

      .invitation-names {
        font-family: var(--font-serif);
        font-size: clamp(32px, 5vw, 52px);
        font-weight: 500;
        letter-spacing: 3px;
        color: var(--forest-deep);
        margin-bottom: 20px;
      }

      .invitation-tagline {
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--sage-muted);
        margin-bottom: 28px;
      }

      .invitation-divider {
        width: 140px;
        height: auto;
        display: block;
        margin: 0 auto;
        opacity: 0.85;
      }

      /* Family Grid */
      .family-grid {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 32px;
        align-items: center;
        margin-top: 50px;
        padding: 38px 32px;
        background: #FDFCF9;
        border: 1px solid var(--antique-gold-light);
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(52, 76, 59, 0.04);
      }

      .family-col {
        text-align: center;
      }

      .family-role {
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: var(--antique-gold);
        margin-bottom: 8px;
      }

      .family-name {
        font-family: var(--font-serif);
        font-size: clamp(18px, 2.4vw, 22px);
        font-weight: 600;
        letter-spacing: 1.2px;
        color: var(--forest-deep);
        margin-bottom: 4px;
        text-transform: uppercase;
      }

      .family-location {
        font-family: var(--font-sans);
        font-size: 12px;
        letter-spacing: 1.5px;
        color: var(--sage-muted);
      }

      .family-vertical-divider {
        width: 1px;
        height: 60px;
        background: var(--antique-gold-light);
      }

      /* ==================== 4. TIMELINE ==================== */
      .timeline-section-wrap {
        max-width: 980px;
        margin: 0 auto;
      }

      .timeline-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 36px;
        position: relative;
      }

      .timeline-grid::before {
        content: '';
        position: absolute;
        top: 40px;
        bottom: 40px;
        left: 50%;
        width: 1px;
        background: dashed var(--antique-gold);
        opacity: 0.4;
        transform: translateX(-50%);
      }

      .timeline-card {
        background: #FDFCF9;
        border: 1px solid var(--antique-gold-light);
        border-radius: 18px;
        padding: 42px 36px;
        position: relative;
        text-align: center;
        box-shadow: 0 14px 40px rgba(52, 76, 59, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .timeline-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 50px rgba(52, 76, 59, 0.09);
      }

      .timeline-badge {
        display: inline-block;
        padding: 6px 16px;
        background: var(--sage-pale);
        border: 1px solid var(--sage-soft);
        border-radius: 20px;
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: var(--forest-deep);
        margin-bottom: 18px;
      }

      .timeline-event-title {
        font-family: var(--font-serif);
        font-size: 28px;
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--forest-deep);
        margin-bottom: 8px;
      }

      .timeline-date {
        font-family: var(--font-sans);
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--antique-gold);
        margin-bottom: 6px;
      }

      .timeline-time {
        font-family: var(--font-sans);
        font-size: 13px;
        color: var(--sage-muted);
        margin-bottom: 18px;
        letter-spacing: 1px;
      }

      .timeline-divider {
        width: 60px;
        height: 1px;
        background: var(--antique-gold-light);
        margin: 0 auto 18px auto;
      }

      .timeline-location-title {
        font-family: var(--font-serif);
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: var(--forest-deep);
        margin-bottom: 4px;
      }

      .timeline-city {
        font-family: var(--font-sans);
        font-size: 13px;
        color: var(--text-muted);
        letter-spacing: 1px;
      }

      /* ==================== 5. EVENT CARDS ==================== */
      .events-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 36px;
        max-width: 1080px;
        margin: 0 auto;
      }

      .event-card {
        background: #FDFCF9;
        border: 1px solid var(--antique-gold);
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 
          0 0 0 5px rgba(201, 216, 198, 0.28),
          0 20px 50px rgba(52, 76, 59, 0.06);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        position: relative;
      }

      .event-card:hover {
        transform: translateY(-4px);
        box-shadow: 
          0 0 0 5px rgba(201, 216, 198, 0.4),
          0 26px 60px rgba(52, 76, 59, 0.1);
      }

      .event-card-header {
        background: linear-gradient(135deg, var(--sage-pale) 0%, rgba(201, 216, 198, 0.4) 100%);
        border-bottom: 1px solid var(--antique-gold-light);
        padding: 34px 28px;
        text-align: center;
        position: relative;
      }

      .event-card-icon {
        width: 36px;
        height: 36px;
        margin: 0 auto 12px auto;
        display: block;
      }

      .event-tag {
        display: inline-block;
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--antique-gold);
        margin-bottom: 6px;
      }

      .event-name {
        font-family: var(--font-serif);
        font-size: 34px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--forest-deep);
      }

      .event-card-body {
        padding: 38px 36px 44px 36px;
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
      }

      .event-details-list {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-bottom: 34px;
      }

      .detail-row {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        text-align: left;
      }

      .detail-icon {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        margin-top: 3px;
        stroke: var(--antique-gold);
      }

      .detail-content {
        flex: 1;
      }

      .detail-label {
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--sage-muted);
        margin-bottom: 4px;
      }

      .detail-value {
        font-family: var(--font-sans);
        font-size: 16px;
        font-weight: 500;
        color: var(--forest-deep);
        line-height: 1.5;
      }

      .detail-value.venue-name {
        font-family: var(--font-serif);
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .detail-value.venue-address {
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-dark);
      }

      .event-action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 16px 24px;
        background: var(--forest-deep);
        color: var(--ivory);
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        text-decoration: none;
        border-radius: 8px;
        border: 1px solid var(--forest-deep);
        box-shadow: 0 4px 14px rgba(52, 76, 59, 0.18);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
      }

      .event-action-btn:hover {
        background: #253629;
        border-color: var(--antique-gold);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(52, 76, 59, 0.25);
      }

      .event-action-btn svg {
        transition: transform 0.25s ease;
      }

      .event-action-btn:hover svg {
        transform: translateX(3px);
      }

      /* ==================== 6. LOCATIONS ==================== */
      .locations-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 36px;
        max-width: 1080px;
        margin: 0 auto;
      }

      .location-card {
        background: #FDFCF9;
        border: 1px solid var(--antique-gold-light);
        border-radius: 18px;
        padding: 42px 36px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 14px 40px rgba(52, 76, 59, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .location-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 50px rgba(52, 76, 59, 0.09);
      }

      .location-district-badge {
        display: inline-block;
        padding: 6px 14px;
        background: var(--sage-pale);
        border: 1px solid var(--sage-soft);
        border-radius: 20px;
        font-family: var(--font-sans);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--forest-deep);
        margin-bottom: 18px;
      }

      .location-venue-name {
        font-family: var(--font-serif);
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: var(--forest-deep);
        margin-bottom: 12px;
      }

      .location-address {
        font-family: var(--font-sans);
        font-size: 14px;
        line-height: 1.7;
        color: var(--text-dark);
        margin-bottom: 28px;
      }

      .location-map-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 13px 22px;
        border: 1px solid var(--antique-gold);
        border-radius: 8px;
        background: transparent;
        color: var(--forest-deep);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        text-decoration: none;
        transition: all 0.25s ease;
      }

      .location-map-btn:hover {
        background: var(--forest-deep);
        color: var(--ivory);
        border-color: var(--forest-deep);
      }

      /* ==================== 7. COUNTDOWN ==================== */
      .countdown-section-wrap {
        max-width: 780px;
        margin: 0 auto;
        text-align: center;
        background: #FDFCF9;
        border: 1px solid var(--antique-gold);
        border-radius: 20px;
        padding: 56px 40px;
        box-shadow: 
          0 0 0 5px rgba(201, 216, 198, 0.25),
          0 20px 50px rgba(52, 76, 59, 0.05);
      }

      .countdown-heading {
        font-family: var(--font-script);
        font-size: clamp(30px, 4vw, 42px);
        color: var(--antique-gold);
        margin-bottom: 30px;
      }

      .countdown-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      .countdown-card {
        background: var(--sage-pale);
        border: 1px solid var(--sage-soft);
        border-radius: 12px;
        padding: 20px 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .countdown-number {
        font-family: var(--font-serif);
        font-size: clamp(32px, 5vw, 48px);
        font-weight: 600;
        color: var(--forest-deep);
        line-height: 1.1;
      }

      .countdown-label {
        font-family: var(--font-sans);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--sage-muted);
        margin-top: 6px;
      }

      /* ==================== 8. CLOSING SECTION ==================== */
      .closing-section-wrap {
        max-width: 820px;
        margin: 0 auto;
        text-align: center;
        position: relative;
      }

      .closing-box {
        background: #FDFCF9;
        border: 1px solid var(--antique-gold);
        border-radius: 20px;
        padding: 64px 48px;
        position: relative;
        box-shadow: 
          0 0 0 6px rgba(201, 216, 198, 0.28),
          0 20px 50px rgba(52, 76, 59, 0.06);
      }

      .closing-inner-border {
        position: absolute;
        inset: 10px;
        border-radius: 14px;
        border: 1px dashed rgba(182, 154, 112, 0.45);
        pointer-events: none;
      }

      .closing-title {
        font-family: var(--font-serif);
        font-size: clamp(26px, 3.8vw, 38px);
        font-weight: 500;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: var(--forest-deep);
        margin-bottom: 14px;
        line-height: 1.3;
      }

      .closing-script {
        font-family: var(--font-script);
        font-size: clamp(26px, 3.5vw, 34px);
        color: var(--antique-gold);
        margin-bottom: 24px;
      }

      .closing-names {
        font-family: var(--font-serif);
        font-size: clamp(28px, 4vw, 42px);
        font-weight: 500;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--forest-deep);
        margin-bottom: 8px;
      }

      .closing-hashtag {
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 3.5px;
        color: var(--antique-gold);
        margin-bottom: 24px;
      }

      .closing-sprig {
        width: 44px;
        height: auto;
        display: block;
        margin: 0 auto;
        opacity: 0.85;
      }

      /* ==================== FOOTER ==================== */
      .site-footer {
        border-top: 1px solid var(--antique-gold-light);
        background: #F4F3ED;
        padding: 38px 24px;
        position: relative;
        z-index: 10;
      }

      .footer-inner {
        max-width: 1240px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: var(--sage-muted);
      }

      /* Animations */
      @keyframes heroFadeUp {
        from {
          opacity: 0;
          transform: translateY(18px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes floatSlow {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(6px);
        }
      }

      /* ==================== RESPONSIVE BREAKPOINTS ==================== */
      @media (max-width: 1024px) {
        .events-grid,
        .locations-grid {
          gap: 24px;
        }

        .invitation-box {
          padding: 56px 40px;
        }
      }

      @media (max-width: 809.98px) {
        .nav-links-desktop {
          display: none;
        }

        .nav-toggle-btn {
          display: block;
        }

        .hero-section {
          padding: 96px 18px 48px 18px;
        }

        .hero-arch-card {
          padding: 52px 24px 40px 24px;
          border-radius: 220px 220px 18px 18px;
        }

        .hero-arch-inner-border {
          border-radius: 212px 212px 14px 14px;
        }

        .botanical-tl {
          width: 220px;
        }

        .botanical-br {
          width: 200px;
        }

        .family-grid {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .family-vertical-divider {
          width: 90px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--antique-gold), transparent);
          margin: 0 auto;
        }

        .timeline-grid {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .timeline-grid::before {
          display: none;
        }

        .events-grid,
        .locations-grid {
          grid-template-columns: 1fr;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }

        .footer-inner {
          flex-direction: column;
          text-align: center;
          justify-content: center;
          gap: 12px;
        }
      }

      @media (max-width: 480px) {
        .hero-section {
          padding: 86px 14px 40px 14px;
        }

        .hero-arch-card {
          padding: 44px 16px 36px 16px;
          border-radius: 180px 180px 16px 16px;
        }

        .hero-arch-inner-border {
          border-radius: 172px 172px 12px 12px;
        }

        .hero-names {
          font-size: 32px;
          gap: 6px 10px;
        }

        .hero-weds {
          font-size: 26px;
        }

        .invitation-box {
          padding: 44px 18px;
        }

        .invitation-inner-border {
          inset: 6px;
        }

        .invitation-quote {
          font-size: 15px;
          letter-spacing: 0.8px;
        }

        .timeline-card,
        .location-card,
        .countdown-section-wrap,
        .closing-box {
          padding: 32px 18px;
        }

        .countdown-grid {
          gap: 8px;
        }

        .countdown-card {
          padding: 14px 6px;
        }

        .countdown-number {
          font-size: 28px;
        }

        .event-card-body {
          padding: 26px 20px 32px 20px;
        }

        .event-card-header {
          padding: 26px 18px;
        }

        .event-name {
          font-size: 28px;
        }
      }
    </style>
</head>

<body>
    <!-- 1. NAVIGATION HEADER -->
    <header class="site-header" id="site-header" data-framer-name="Navigation">
        <div class="nav-container">
            <a href="#hero" class="nav-brand" aria-label="Aju and Naaji Wedding Home">
                <img src="assets/monogram.svg" alt="A | N Monogram" width="76" height="44">
            </a>

            <nav class="nav-links-desktop" aria-label="Primary Navigation">
                <a href="#hero">Home</a>
                <a href="#invitation">Invitation</a>
                <a href="#celebrations">Celebrations</a>
                <a href="#nikkah">Nikkah</a>
                <a href="#reception">Reception</a>
                <a href="#locations">Locations</a>
            </nav>

            <button class="nav-toggle-btn" id="mobile-hamburger" aria-label="Open Navigation Menu" aria-expanded="false" aria-controls="mobile-drawer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </div>
    </header>

    <!-- Mobile Drawer Overlay Menu -->
    <div class="mobile-menu-drawer" id="mobile-drawer" aria-hidden="true">
        <button class="drawer-close-btn" id="drawer-close" aria-label="Close Navigation Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <div class="drawer-brand">
            <img src="assets/monogram.svg" alt="A | N Monogram" width="68" height="40">
        </div>

        <nav aria-label="Mobile Navigation">
            <ul>
                <li><a href="#hero" class="drawer-link">Home</a></li>
                <li><a href="#invitation" class="drawer-link">Invitation</a></li>
                <li><a href="#celebrations" class="drawer-link">Celebrations</a></li>
                <li><a href="#nikkah" class="drawer-link">Nikkah</a></li>
                <li><a href="#reception" class="drawer-link">Reception</a></li>
                <li><a href="#locations" class="drawer-link">Locations</a></li>
            </ul>
        </nav>

        <p class="drawer-footer">02 &bull; 03 JANUARY 2027 &bull; KERALA</p>
    </div>

    <!-- MAIN PAGE WRAPPER -->
    <div id="main" data-framer-name="PageWrapper">

        <!-- ==================== 2. HERO SECTION ==================== -->
        <section class="hero-section" id="hero" data-framer-name="Hero" data-botanical="hero">
            <div class="hero-bg-accent"></div>
            <img src="assets/floral_top_left.png" alt="" class="botanical-corner botanical-tl" loading="eager" aria-hidden="true">
            <img src="assets/floral_bottom_right.png" alt="" class="botanical-corner botanical-br" loading="eager" aria-hidden="true">

            <!-- Centered Ornamental Arch Card -->
            <div class="hero-arch-card" data-botanical-content>
                <div class="hero-arch-inner-border"></div>

                <!-- Monogram Emblem -->
                <div class="hero-emblem">
                    <img src="assets/monogram.svg" alt="Aju and Naaji Emblem" width="96" height="56">
                </div>

                <!-- Small Subtitle -->
                <p class="hero-subtitle">THE WEDDING CELEBRATION OF</p>

                <!-- Couple Names Heading -->
                <div class="hero-names-wrap">
                    <h1 class="hero-names">
                        <span>AJU</span>
                        <span class="hero-weds">weds</span>
                        <span>NAAJI</span>
                    </h1>
                </div>

                <!-- Wedding Date -->
                <div class="hero-date-badge">
                    <span class="hero-date-text">02 JANUARY 2027</span>
                    <span class="hero-dot">&bull;</span>
                    <span class="hero-date-text">03 JANUARY 2027</span>
                </div>

                <!-- Location -->
                <p class="hero-location">FEROKE, KOZHIKODE &bull; CHALAD, KANNUR</p>

                <!-- Social Hashtag -->
                <p class="hero-hashtag">#AJUNAAJI</p>

                <!-- Scroll Down Link -->
                <a href="#invitation" class="hero-scroll-btn" aria-label="Scroll to Invitation">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </a>
            </div>
        </section>

        <!-- ==================== 3. INVITATION & FAMILY SECTION ==================== -->
        <section class="content-section" id="invitation" data-framer-name="Invitation" data-botanical="invitation">
            <div class="invitation-card-wrap" data-botanical-content>
                <!-- Central Card Box -->
                <div class="invitation-box" data-reveal="up">
                    <div class="invitation-inner-border"></div>

                    <img src="assets/monogram.svg" alt="" class="invitation-badge" aria-hidden="true">

                    <p class="invitation-heading-script">The Wedding Celebration</p>

                    <p class="invitation-quote">
                        TOGETHER WITH OUR FAMILIES, WE JOYFULLY INVITE YOU TO CELEBRATE THE WEDDING OF AJU &amp; NAJI.
                    </p>

                    <p class="invitation-names">AJU &amp; NAAJI</p>

                    <p class="invitation-tagline">AN INTIMATE CELEBRATION ACROSS TWO HISTORIC CITIES OF KERALA</p>

                    <img src="assets/divider_ornament.svg" alt="" class="invitation-divider" aria-hidden="true">
                </div>

                <!-- Family Lineage Block -->
                <div class="family-grid" data-reveal="up" data-reveal-delay="200">
                    <div class="family-col" data-reveal="up" data-reveal-delay="300">
                        <p class="family-role">BRIDE'S PARENTS</p>
                        <p class="family-name">ABDUL NASER AM &amp; NAJUMUNISHA</p>
                        <p class="family-location">Kozhikode, Kerala</p>
                    </div>

                    <div class="family-vertical-divider" aria-hidden="true"></div>

                    <div class="family-col" data-reveal="up" data-reveal-delay="450">
                        <p class="family-role">GROOM'S PARENTS</p>
                        <p class="family-name">ABDUL RAUF CH &amp; RUBEENA LV</p>
                        <p class="family-location">Kannur, Kerala</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== 4. TIMELINE ==================== -->
        <section class="content-section" id="celebrations" data-framer-name="Celebrations" data-botanical="timeline">
            <div class="celebration-content-wrap" data-botanical-content>
                <div class="section-header" data-reveal="up">
                    <span class="section-script-tag">The Gatherings</span>
                    <h2 class="section-title">THE CELEBRATION</h2>
                    <p class="section-subtitle">TWO DAYS. TWO GATHERINGS. ONE JOYFUL OCCASION.</p>
                    <img src="assets/divider_ornament.svg" alt="" class="section-divider-flower" aria-hidden="true">
                </div>

                <div class="timeline-section-wrap">
                    <div class="timeline-container">
                        <div class="timeline-grid">
                            <!-- DAY 1: NIKKAH -->
                            <div class="timeline-card" data-reveal="up" data-reveal-delay="150">
                                <span class="timeline-badge">DAY 01 &bull; KOZHIKODE</span>
                                <h3 class="timeline-event-title">NIKKAH</h3>
                                <p class="timeline-date">SATURDAY, 02 JANUARY 2027</p>
                                <p class="timeline-time">11:00 AM – 3:00 PM</p>
                                <div class="timeline-divider"></div>
                                <p class="timeline-location-title">ROYAL ALLIANCE AUDITORIUM</p>
                                <p class="timeline-city">Mannarpadam, Feroke, Kozhikode</p>
                            </div>

                            <!-- DAY 2: RECEPTION -->
                            <div class="timeline-card" data-reveal="up" data-reveal-delay="300">
                                <span class="timeline-badge">DAY 02 &bull; KANNUR</span>
                                <h3 class="timeline-event-title">RECEPTION</h3>
                                <p class="timeline-date">SUNDAY, 03 JANUARY 2027</p>
                                <p class="timeline-time">11:30 AM – 8:00 PM</p>
                                <div class="timeline-divider"></div>
                                <p class="timeline-location-title">GROOM'S RESIDENCE</p>
                                <p class="timeline-city">Rubeenas, Chillikunnu Road, Chalad, Kannur</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== 5. EVENT DETAILS ==================== -->
        <section class="content-section" id="events-detail" data-framer-name="EventDetails">
            <div class="section-header" data-reveal="up">
                <span class="section-script-tag">Schedule &amp; Venues</span>
                <h2 class="section-title">EVENT DETAILS</h2>
                <p class="section-subtitle">JOIN US FOR EACH CEREMONY</p>
                <img src="assets/divider_ornament.svg" alt="" class="section-divider-flower" aria-hidden="true">
            </div>

            <div class="events-grid">
                <!-- NIKKAH CARD -->
                <article class="event-card event-card-nikkah" id="nikkah" data-reveal="up" data-reveal-delay="150">
                    <div class="event-card-header">
                        <img src="assets/icon_dome.svg" alt="" class="event-card-icon" aria-hidden="true">
                        <span class="event-tag">THE CEREMONY</span>
                        <h3 class="event-name">NIKKAH</h3>
                    </div>

                    <div class="event-card-body">
                        <div class="event-details-list">
                            <!-- Date -->
                            <div class="detail-row">
                                <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <div class="detail-content">
                                    <p class="detail-label">DATE &bull; DAY 1</p>
                                    <p class="detail-value">Saturday, 02 January 2027</p>
                                </div>
                            </div>

                            <!-- Time -->
                            <div class="detail-row">
                                <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <div class="detail-content">
                                    <p class="detail-label">TIME</p>
                                    <p class="detail-value">11:00 AM – 3:00 PM</p>
                                </div>
                            </div>

                            <!-- Venue -->
                            <div class="detail-row">
                                <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <div class="detail-content">
                                    <p class="detail-label">VENUE</p>
                                    <p class="detail-value venue-name">ROYAL ALLIANCE AUDITORIUM</p>
                                    <p class="detail-value venue-address">
                                        KADALUNDI ROAD, MANNARPADAM, FEROKE, KOZHIKODE, 673631
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Action Button -->
                        <a href="https://maps.app.goo.gl/1vAmSiUuUUooR2TE8" target="_blank" rel="noopener noreferrer" class="event-action-btn">
                            <span>VIEW ON GOOGLE MAPS</span>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </a>
                    </div>
                </article>

                <!-- RECEPTION CARD -->
                <article class="event-card event-card-reception" id="reception" data-reveal="up" data-reveal-delay="300">
                    <div class="event-card-header">
                        <img src="assets/icon_reception.svg" alt="" class="event-card-icon" aria-hidden="true">
                        <span class="event-tag">THE RECEPTION</span>
                        <h3 class="event-name">RECEPTION</h3>
                    </div>

                    <div class="event-card-body">
                        <div class="event-details-list">
                            <!-- Date -->
                            <div class="detail-row">
                                <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <div class="detail-content">
                                    <p class="detail-label">DATE &bull; DAY 2</p>
                                    <p class="detail-value">Sunday, 03 January 2027</p>
                                </div>
                            </div>

                            <!-- Time -->
                            <div class="detail-row">
                                <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <div class="detail-content">
                                    <p class="detail-label">TIME</p>
                                    <p class="detail-value">11:30 AM – 8:00 PM</p>
                                </div>
                            </div>

                            <!-- Venue -->
                            <div class="detail-row">
                                <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <div class="detail-content">
                                    <p class="detail-label">VENUE</p>
                                    <p class="detail-value venue-name">GROOM'S RESIDENCE</p>
                                    <p class="detail-value venue-address">
                                        RUBEENAS CHILLIKUNNU ROAD, CHALAD, KANNUR 14
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Action Button -->
                        <a href="https://maps.google.com/?q=11.876903,75.353790" target="_blank" rel="noopener noreferrer" class="event-action-btn">
                            <span>VIEW ON GOOGLE MAPS</span>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </a>
                    </div>
                </article>
            </div>
        </section>

        <!-- ==================== 6. LOCATIONS ==================== -->
        <section class="content-section" id="locations" data-framer-name="Locations">
            <div class="section-header" data-reveal="up">
                <span class="section-script-tag">Getting There</span>
                <h2 class="section-title">FIND THE CELEBRATION</h2>
                <p class="section-subtitle">INTERACTIVE MAPS TO BOTH VENUES</p>
                <img src="assets/divider_ornament.svg" alt="" class="section-divider-flower" aria-hidden="true">
            </div>

            <div class="locations-grid">
                <!-- VENUE 1: FEROKE -->
                <div class="location-card" data-reveal="up" data-reveal-delay="150">
                    <div>
                        <span class="location-district-badge">KOZHIKODE DISTRICT</span>
                        <h3 class="location-venue-name">ROYAL ALLIANCE AUDITORIUM</h3>
                        <p class="location-address">
                            KADALUNDI ROAD, MANNARPADAM, FEROKE, KOZHIKODE, 673631
                        </p>
                    </div>
                    <a href="https://maps.app.goo.gl/1vAmSiUuUUooR2TE8" target="_blank" rel="noopener noreferrer" class="location-map-btn">
                        <span>OPEN IN GOOGLE MAPS</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </a>
                </div>

                <!-- VENUE 2: KANNUR -->
                <div class="location-card" data-reveal="up" data-reveal-delay="300">
                    <div>
                        <span class="location-district-badge">KANNUR DISTRICT</span>
                        <h3 class="location-venue-name">GROOM'S RESIDENCE</h3>
                        <p class="location-address">
                            RUBEENAS CHILLIKUNNU ROAD, CHALAD, KANNUR 14
                        </p>
                    </div>
                    <a href="https://maps.google.com/?q=11.876903,75.353790" target="_blank" rel="noopener noreferrer" class="location-map-btn">
                        <span>OPEN IN GOOGLE MAPS</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </section>

        <!-- ==================== 7. COUNTDOWN ==================== -->
        <section class="content-section" id="countdown" data-framer-name="Countdown">
            <div class="countdown-section-wrap" data-reveal="up">
                <p class="countdown-heading">The Celebration Begins In</p>

                <div class="countdown-grid">
                    <div class="countdown-card">
                        <span class="countdown-number" id="cd-days">00</span>
                        <span class="countdown-label">DAYS</span>
                    </div>
                    <div class="countdown-card">
                        <span class="countdown-number" id="cd-hours">00</span>
                        <span class="countdown-label">HOURS</span>
                    </div>
                    <div class="countdown-card">
                        <span class="countdown-number" id="cd-minutes">00</span>
                        <span class="countdown-label">MINUTES</span>
                    </div>
                    <div class="countdown-card">
                        <span class="countdown-number" id="cd-seconds">00</span>
                        <span class="countdown-label">SECONDS</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== 8. CLOSING SECTION ==================== -->
        <section class="content-section" id="closing" data-framer-name="Closing" data-botanical="closing">
            <div class="closing-section-wrap" data-botanical-content>
                <div class="closing-box" data-reveal="up">
                    <div class="closing-inner-border"></div>

                    <h2 class="closing-title">WE LOOK FORWARD TO CELEBRATING WITH YOU</h2>
                    <p class="closing-script">With blessings &amp; warmth</p>

                    <p class="closing-names">AJU &amp; NAAJI</p>
                    <p class="closing-hashtag">#AJUNAAJI</p>

                    <img src="assets/olive_sprig.svg" alt="" class="closing-sprig" aria-hidden="true">
                </div>
            </div>
        </section>

        <!-- ==================== 9. CLEAN CLIENT-FACING FOOTER ==================== -->
        <footer class="site-footer" data-framer-name="Footer">
            <div class="footer-inner">
                <div class="footer-left">
                    02 &amp; 03 JANUARY 2027 &bull; KERALA, INDIA
                </div>
                <div class="footer-right">
                    AJU &amp; NAAJI &bull; #AJUNAAJI
                </div>
            </div>
        </footer>

    </div>

    <div id="__framer-badge-container"></div>

    <script type="module" src="assets/framerusercontent.com/sites/oMyeNIrYwrAPBFlyQ0rhP/script_main.BycT4FBw.mjs"></script>
    <script src="assets/js/botanical-motion.js" defer></script>
    <script src="assets/js/hover-bloom.js" defer></script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent);
console.log('Successfully generated index.html with new Botanical Motion system!');
