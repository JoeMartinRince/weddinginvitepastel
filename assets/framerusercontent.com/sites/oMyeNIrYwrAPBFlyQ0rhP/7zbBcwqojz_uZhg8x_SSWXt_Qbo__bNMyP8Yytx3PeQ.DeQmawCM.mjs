import{t as e}from"./rolldown-runtime.Bi-D_2cA.mjs";async function t(e,t,i){let a=r[e],o=a?await a(t,i):void 0,s={bodyEnd:[],bodyStart:[],headEnd:[],headStart:[]};for(let t of n){if(t.pageIds&&!t.pageIds.has(e))continue;let n=t.code(o);n&&s[t.placement].push({...t,code:n})}return s}var n,r,i,a;function o(){return(o=e((()=>{n=[{code:e=>`<script>
(function () {
  var DURATION = 2600;

  var style = document.createElement("style");
  style.textContent = "html.sl-lock, html.sl-lock body { overflow: hidden !important; }";
  document.head.appendChild(style);

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  var root = document.documentElement;
  root.classList.add("sl-lock");
  window.scrollTo(0, 0);

  function stop(e) { e.preventDefault(); }
  var keys = { 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 38: 1, 40: 1 };
  function stopKeys(e) { if (keys[e.keyCode]) e.preventDefault(); }

  window.addEventListener("wheel", stop, { passive: false });
  window.addEventListener("touchmove", stop, { passive: false });
  window.addEventListener("keydown", stopKeys, { passive: false });

  window.addEventListener("load", function () { window.scrollTo(0, 0); });

  setTimeout(function () {
    root.classList.remove("sl-lock");
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchmove", stop);
    window.removeEventListener("keydown", stopKeys);
  }, DURATION);
})();
<\/script>`,id:`WjUJwuogP`,loadMode:`once`,name:`Scroll Lock`,pageIds:/* @__PURE__ */ new Set([`augiA20Il`]),placement:`bodyEnd`}],r={},i={bodyEnd:[`WjUJwuogP`],bodyStart:[],headEnd:[],headStart:[]},a={exports:{snippetsSorting:{type:`variable`,annotations:{framerContractVersion:`1`}},getSnippets:{type:`function`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}})))()}o();export{a as __FramerMetadata__,t as getSnippets,i as snippetsSorting};
//# sourceMappingURL=7zbBcwqojz_uZhg8x_SSWXt_Qbo__bNMyP8Yytx3PeQ.DeQmawCM.mjs.map