/**
 * Site mode configuration - controls which portfolio version renders.
 * Valid values: 'cto' | 'engineer'
 * Default: 'cto' (CTO / VP Engineering narrative)
 *
 * To switch: change SITE_MODE below, commit, and push. No build step needed.
 * This file MUST load synchronously in <head> before Tailwind/CSS to prevent FOUC.
 */
(function () {
  'use strict';

  var SITE_MODE = 'cto';

  window.SITE_MODE = SITE_MODE;
  document.documentElement.setAttribute('data-site-mode', SITE_MODE);

  document.addEventListener('DOMContentLoaded', function () {
    var mode = window.SITE_MODE;

    var metaMap = {
      cto: {
        title: 'Nitender Kumar | Technology Leader - CTO & VP Engineering',
        description: 'Engineering executive building AI platforms and data systems at enterprise scale. 12+ person teams, 5TB+/day streaming, governed GenAI, 30% cloud cost reduction. Open to CTO and VP Engineering roles.'
      },
      engineer: {
        title: 'Nitender Kumar | Platform & AI Engineering Leader',
        description: 'Technology leader shipping production AI platforms, terabyte-scale streaming, and multi-tenant agentic systems. Executive scope across architecture, cloud economics, and engineering delivery.'
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
    var downloadLinks = document.querySelectorAll('a[href$="resume.pdf"]');
    for (var i = 0; i < downloadLinks.length; i++) {
      downloadLinks[i].setAttribute('download', resumeFilename);
    }
  });
})();
