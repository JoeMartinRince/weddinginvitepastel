function initAjuNaaji(root) {
  try {
    document.dispatchEvent(new CustomEvent('framer:pageview', { detail: { framerLocale: null } }));
  } catch(e) {}

  // 1. Sticky Navigation
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('nav-scrolled');
      } else {
        header.classList.remove('nav-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Drawer
  const hamburger = document.getElementById('mobile-hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');

  function openMenu() {
    if (drawer) {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer && drawer.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        closeMenu();
      }
    });
  }

  // 3. Scroll Reveal & Botanical Blooming (Plays once on scroll)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.classList.add('is-bloomed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll, .animated-botanical-trigger').forEach(el => {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-on-scroll, .animated-botanical-trigger').forEach(el => {
      el.classList.add('is-visible');
      el.classList.add('is-bloomed');
    });
  }

  // 4. Live Countdown Timer (02 January 2027 at 11:00 AM IST)
  const targetDate = new Date('2027-01-02T11:00:00+05:30').getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

import{t as e}from"./rolldown-runtime.Bi-D_2cA.mjs";import{E as t,I as n,L as r,N as i,O as a,P as o,R as s,S as c,_ as l,a as u,b as d,d as f,g as p,h as m,i as h,n as g,r as _,t as v,w as y,y as b}from"./react.Dxe_2v0O.mjs";import{$ as x,B as S,J as C,K as w,R as T,U as E,V as D,W as O,X as k,Z as ee,_t as te,f as ne,h as re,i as ie,l as ae,m as A,nt as j,ot as M,q as N,ut as P,yt as F,z as I}from"./framer.CwuP0MtH.mjs";import{n as L,t as R}from"./toplevel-deps.CmIvjdCm.mjs";function z({webPageId:e,children:t,style:n,...r}){let i={}[e]??{};switch(e){case`augiA20Il`:case`T8czuGMwU`:return f(R,{...i,key:`MainLayout`,style:n},t(!0));default:return t(!1)}}function B(e){switch(e){case`augiA20Il`:case`T8czuGMwU`:return[{hash:`1dahnlg`,mediaQuery:`(max-width: 809.98px)`},{hash:`156cp8d`,mediaQuery:`(min-width: 810px) and (max-width: 1199.98px)`},{hash:`1weqkcm`,mediaQuery:`(min-width: 1200px)`}];default:return}}function V({routeId:e,pathVariables:t,localeId:n}){return Q??=C({routes:G,routeId:e,pathVariables:t,localeId:n,locales:K,collectionUtils:q}),Q}async function H({routeId:e,pathVariables:n,canonicalPathVariables:r,localeId:i,collectionItemId:u,contentLocaleId:p,shouldResolveInitialRouteContentState:m=!1}){ee({checkServerSideRouter:!0,disableCustomCode:!1,disableHoverOnMobile:!1,editorBarDisableFrameAncestorsSecurity:!1,motionDivToDiv:!1,scrollRestoration:!0,synchronousNavigationOnDesktop:!1,yieldOnTap:!1}),k(Y);let g=!X&&G[e].abTestingParentId?{...G}:G;g!==G&&w(g,e);let _=G[e].page.preload(),v=G[e];if(m&&u===void 0&&v.collectionId){let t=await V({routeId:e,pathVariables:n,localeId:i});p??=t.contentLocaleId,r??=t.canonicalPathVariables}let y=f(re,{isWebsite:!0,environment:`site`,routeId:e,pathVariables:n,canonicalPathVariables:r,routes:g,collectionUtils:q,serverDatabaseClient:J,framerSiteId:Y,notFoundPage:D(()=>import(`./4ZYh6OXIW5XN8WqvyXr7Rb7CrSh7YES1IP5xjjx-jyU.BCjm3UAf.mjs`)),isReducedMotion:void 0,localeId:i,locales:K,preserveQueryParams:void 0,siteCanonicalURL:void 0,EditorBar:s===void 0?void 0:(()=>{if(Z)console.log(`[Framer On-Page Editing] Unavailable because navigator is bot`);else return D(async()=>{s.__framer_editorBarDependencies={__version:3,framer:{useCurrentRoute:j,useLocaleInfo:M,useRouter:P},react:{createElement:f,Fragment:o,memo:c,useCallback:a,useEffect:b,useRef:d,useState:l,useLayoutEffect:t},"react-dom":{createPortal:h}};let{createEditorBar:e}=await import(`../../../../assets/framer.com/edit/init.mjs`);return{default:e()}})})(),adaptLayoutToTextDirection:!0,LayoutTemplate:z,loadSnippetsModule:new ne(()=>import(`./7zbBcwqojz_uZhg8x_SSWXt_Qbo__bNMyP8Yytx3PeQ.DeQmawCM.mjs`)),initialCollectionItemId:u,initialContentLocaleIdOverride:p}),x=f(ae,{children:y}),S=f(A,{children:x,value:{routes:{}}});return await _,S}function U(){X&&s.__framer_events.push(arguments)}async function W(e,t){function n(e,t,n=!0){if(e.caught||s.__framer_hadFatalError)return;let r=t?.componentStack;if(n){if(console.warn(`Caught a recoverable error. The site is still functional, but might have some UI flickering or degraded page load performance. If you are the author of this website, update external components and check recently added custom code or code overrides to fix the following server/client mismatches:
`,e,r),Math.random()>.01)return}else console.error(`Caught a fatal error. Please report the following to the Framer team via https://www.framer.com/contact/:
`,e,r);U(n?`published_site_load_recoverable_error`:`published_site_load_error`,{message:String(e),componentStack:r,stack:r?void 0:e instanceof Error&&typeof e.stack==`string`?e.stack:null})}try{let r,a,o,c,l,u,d;if(e)d=JSON.parse(t.dataset.framerHydrateV2),r=d.routeId,a=d.localeId,o=d.contentLocaleId,c=d.pathVariables,l=d.canonicalPathVariables,u=d.breakpoints,r=w(G,r);else{w(G,void 0);let e=performance.getEntriesByType(`navigation`)[0]?.serverTiming?.find(e=>e.name===`route`)?.description;if(e){let t=new URLSearchParams(e);r=t.get(`id`),a=t.get(`locale`);for(let[e,n]of t.entries())e.startsWith(`var.`)&&(c??={},c[e.slice(4)]=n)}if(!r||!a){let e=T(G,decodeURIComponent(location.pathname),!0,K);r=e.routeId,a=e.localeId,c=e.pathVariables}}let f=H({routeId:r,localeId:a,contentLocaleId:o,pathVariables:c,canonicalPathVariables:l,collectionItemId:e?d?.collectionItemId:void 0,shouldResolveInitialRouteContentState:!e});s!==void 0&&(async()=>{let e=G[r],t=K.find(({id:e})=>a?e===a:e==="default").code,n;n=d?.collectionItemId===void 0?e?.collectionId?await(await V({routeId:r,pathVariables:c,localeId:a})).collectionItemId:null:d.collectionItemId;let i=Intl.DateTimeFormat().resolvedOptions(),o=i.timeZone,l=i.locale;await new Promise(e=>{document.prerendering?document.addEventListener(`prerenderingchange`,e,{once:!0}):e()}),s.__framer_events.push([`published_site_pageview`,{framerSiteId:Y,version:2,routePath:e?.path||`/`,collectionItemId:n,framerLocale:t||null,webPageId:e?.abTestingVariantId??r,abTestId:e?.abTestId,referrer:document.referrer||null,url:s.location.href,hostname:s.location.hostname||null,pathname:s.location.pathname||null,hash:s.location.hash||null,search:s.location.search||null,timezone:o,locale:l},`eager`]),await F({priority:`background`,ensureContinueBeforeUnload:!0,continueAfter:`paint`}),document.dispatchEvent(new CustomEvent(`framer:pageview`,{detail:{framerLocale:t||null}}))})();let p=await f;e?(te(`framer-rewrite-breakpoints`,()=>{N(u),s.__framer_onRewriteBreakpoints?.(u)}),(Z?e=>e():i)(()=>{O(),x(),v(t,p,{onRecoverableError:n})})):(await E(),_(t,{onRecoverableError:n}).render(p))}catch(e){throw n(e,void 0,!1),e}}var G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{if(n(),S(),y(),u(),g(),L(),G={augiA20Il:{elements:{GexlNQqQX:`gallery`,JJbLvAQvw:`story`,kiGKFqcSR:`invitation`,L897jyw2p:`rsvp`,nrXaUPfpQ:`the-day`,OIppgNRt_:`details`,Op4V_5Hae:`date`,TXHCRVkYb:`cover`},page:D(()=>import(`./mc5iaSXTbQHa9PV_PrzxiQMDlrCby3Cn8l0wlZHH7k8.BX973M27.mjs`)),path:`/`},T8czuGMwU:{elements:{},page:D(()=>import(`./4ZYh6OXIW5XN8WqvyXr7Rb7CrSh7YES1IP5xjjx-jyU.BCjm3UAf.mjs`)),path:`/404`}},K=[{code:`en-US`,id:`default`,name:`English`,slug:``,textDirection:`ltr`}],q={},J=void 0,Y=`0ded4f40d4eaaade215a08a95813d2627c44568670f300760232f82ed0be5d5c`,X=typeof document<`u`,Z=X&&/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(r.userAgent),X){s.__framer_importFromPackage=(e,t)=>()=>f(ie,{error:`Package component not supported: "`+t+`" in "`+e+`"`}),s.__framer_events=s.__framer_events||[],I();let e=document.getElementById(`main`);initAjuNaaji(e)}(function(){X&&i(()=>{/* badge handled in footer */})})()})))()}$();export{B as getLayoutTemplateBreakpoints,H as getPageRoot};
//# sourceMappingURL=script_main.BycT4FBw.mjs.map