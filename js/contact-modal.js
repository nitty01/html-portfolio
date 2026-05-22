/**
 * Contact modal helpers (used across footer / contact links).
 */
(function () {
  'use strict';

  var EMAIL = 'nitender.kumar11@gmail.com';
  var LINKEDIN = 'https://www.linkedin.com/in/nitender-kumar/';

  function getModal() {
    return document.getElementById('contactModal');
  }

  window.openContactModal = function () {
    var modal = getModal();
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeContactModal = function () {
    var modal = getModal();
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.copyEmailToClipboard = function () {
    function done() {
      alert('Email address copied to clipboard: ' + EMAIL);
      window.closeContactModal();
    }

    function fallback() {
      var textArea = document.createElement('textarea');
      textArea.value = EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      done();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(fallback);
    } else {
      fallback();
    }
  };

  window.openEmailClient = function () {
    window.location.href = 'mailto:' + EMAIL;
    window.closeContactModal();
  };

  window.openLinkedIn = function () {
    window.open(LINKEDIN, '_blank', 'noopener');
    window.closeContactModal();
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = link.getAttribute('href') || ('mailto:' + EMAIL);
      });
    });
  });
})();
