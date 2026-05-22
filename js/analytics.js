/**
 * Google Analytics + Microsoft Clarity
 */
(function (w, d) {
  'use strict';

  var cfg = w.PORTFOLIO_ANALYTICS || {};
  var gaId = cfg.gaId || 'G-6Y1JBT1EXB';
  var clarityId = cfg.clarityId || 't8hxb4v0kn';
  var isLocal = /^(localhost|127\.0\.0\.1)$/.test(w.location.hostname);
  var head = d.head || d.documentElement;

  w.clarity = w.clarity || function () {
    (w.clarity.q = w.clarity.q || []).push(arguments);
  };

  var clarityScript = d.createElement('script');
  clarityScript.async = true;
  clarityScript.src = 'https://www.clarity.ms/tag/' + clarityId;
  head.appendChild(clarityScript);

  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
  w.gtag('js', new Date());

  var gaScript = d.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
  head.appendChild(gaScript);

  w.gtag('config', gaId, isLocal ? { debug_mode: true } : {});
})(window, document);
