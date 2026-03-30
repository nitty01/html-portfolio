/**
 * Site mode configuration — controls which portfolio version renders.
 * Valid values: 'cto' | 'engineer'
 * Default: 'cto' (Technology Leader narrative)
 *
 * To switch: change SITE_MODE below, commit, and push. No build step needed.
 * This file MUST load synchronously in <head> before Tailwind/CSS to prevent FOUC.
 */
(function () {
  'use strict';

  var SITE_MODE = 'engineer';

  window.SITE_MODE = SITE_MODE;
  document.documentElement.setAttribute('data-site-mode', SITE_MODE);

  document.addEventListener('DOMContentLoaded', function () {
    var mode = window.SITE_MODE;

    var metaMap = {
      cto: {
        title: 'Nitender Kumar | Technology Leader',
        description: 'Technology leader driving AI platform strategy, team building, and enterprise-scale delivery across risk, climate tech, and data intelligence.'
      },
      engineer: {
        title: 'Nitender Kumar | Associate Director \u2013 AI Architect',
        description: 'Associate Director, AI Architect. Enterprise AI platforms, GenAI systems, and event-driven architecture on Azure\u2014risk, compliance, and decision intelligence at scale.'
      }
    };

    var meta = metaMap[mode];
    if (!meta) return;

    document.title = meta.title;

    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', meta.description);

    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    var resumeFilename = mode === 'cto'
      ? 'Nitender_Kumar_Technology_Leader_Resume.pdf'
      : 'Nitender_Kumar_Resume.pdf';
    var downloadLinks = document.querySelectorAll('a[href*="NITENDER_KUMAR_DL"]');
    for (var i = 0; i < downloadLinks.length; i++) {
      downloadLinks[i].setAttribute('download', resumeFilename);
    }
  });
})();
