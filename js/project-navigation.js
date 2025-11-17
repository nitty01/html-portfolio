/**
 * PROJECT NAVIGATION SYSTEM
 * =========================
 * Handles next/previous navigation between project pages.
 * Projects are sequenced based on timeline (most recent first).
 */

(function() {
  'use strict';

  // Project sequence based on timeline (most recent first)
  // Format: { id: 'project-id', name: 'Project Name', file: 'project-filename.html', date: 'YYYY-MM' }
  const projectSequence = [
    { id: 'c6insights', name: 'C6 Insights', file: 'project-c6insights.html', date: '2024-01' },
    { id: 'deep-view-analytics', name: 'Deep View Analytics', file: 'project-deep-view-analytics.html', date: '2024-01' },
    { id: 'qlm', name: 'QLM Platform', file: 'project-qlm.html', date: '2023-03' },
    { id: 'self-analytics', name: 'Self Analytics', file: 'project-self-analytics.html', date: '2022-01' },
    { id: 'paos', name: 'PAOS (Predictive Auto Ordering System)', file: 'project-paos.html', date: '2023-06' },
    { id: 'nec-iot-big-data', name: 'NEC IoT Big Data', file: 'project-nec-iot-big-data.html', date: '2022-08' }
  ];

  // Get current project ID from the page
  function getCurrentProjectId() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    // Map filename to project ID
    const fileToId = {
      'project-c6insights.html': 'c6insights',
      'project-deep-view-analytics.html': 'deep-view-analytics',
      'project-paos.html': 'paos',
      'project-qlm.html': 'qlm',
      'project-nec-iot-big-data.html': 'nec-iot-big-data',
      'project-self-analytics.html': 'self-analytics'
    };
    
    return fileToId[filename] || null;
  }

  // Get navigation info for current project
  // Navigation: Next = older project (forward in array), Previous = newer project (backward in array)
  function getNavigationInfo() {
    const currentId = getCurrentProjectId();
    if (!currentId) return null;

    const currentIndex = projectSequence.findIndex(p => p.id === currentId);
    if (currentIndex === -1) return null;

    // Next = older project (index + 1, going forward in time)
    const nextProject = currentIndex < projectSequence.length - 1 
      ? projectSequence[currentIndex + 1] 
      : null;
    
    // Previous = newer project (index - 1, going backward in time)
    const prevProject = currentIndex > 0 
      ? projectSequence[currentIndex - 1] 
      : null;

    return {
      current: projectSequence[currentIndex],
      previous: prevProject,
      next: nextProject,
      index: currentIndex,
      total: projectSequence.length
    };
  }

  // Initialize navigation on page load
  function initNavigation() {
    const navInfo = getNavigationInfo();
    if (!navInfo) return;

    // Create navigation HTML
    const navHTML = `
      <div class="project-navigation glass rounded-xl p-6 mb-8 border border-accent/20">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm" style="color: var(--text-muted);">
            Project ${navInfo.index + 1} of ${navInfo.total}
          </div>
          
          <div class="flex items-center gap-4 flex-wrap justify-center">
            ${navInfo.previous 
              ? `<a href="${navInfo.previous.file}" 
                     class="project-nav-btn flex items-center gap-2 px-4 sm:px-6 py-3 bg-white/10 hover:bg-accent/20 rounded-lg font-medium transition-all duration-300 hover:scale-105 border border-white/20 hover:border-accent/50" style="color: var(--text-light);">
                  <i class="fas fa-chevron-left"></i>
                  <div class="flex flex-col items-start">
                    <span class="text-xs opacity-75 hidden sm:block">Previous</span>
                    <span class="text-sm font-semibold">${navInfo.previous.name}</span>
                  </div>
                </a>`
              : `<div class="project-nav-btn flex items-center gap-2 px-4 sm:px-6 py-3 bg-white/5 rounded-lg font-medium cursor-not-allowed opacity-50" style="color: var(--text-muted);">
                  <i class="fas fa-chevron-left"></i>
                  <span class="hidden sm:inline">Previous</span>
                </div>`
            }
            
            <a href="../index.html#projects" 
               class="project-nav-btn flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-accent/20 to-accent2/20 hover:from-accent/30 hover:to-accent2/30 rounded-lg font-medium transition-all duration-300 hover:scale-105 border border-accent/30" style="color: var(--text-light);">
              <i class="fas fa-th"></i>
              <span class="hidden sm:inline">All Projects</span>
            </a>
            
            ${navInfo.next 
              ? `<a href="${navInfo.next.file}" 
                     class="project-nav-btn flex items-center gap-2 px-4 sm:px-6 py-3 bg-white/10 hover:bg-accent/20 rounded-lg font-medium transition-all duration-300 hover:scale-105 border border-white/20 hover:border-accent/50" style="color: var(--text-light);">
                  <div class="flex flex-col items-end">
                    <span class="text-xs opacity-75 hidden sm:block">Next</span>
                    <span class="text-sm font-semibold">${navInfo.next.name}</span>
                  </div>
                  <i class="fas fa-chevron-right"></i>
                </a>`
              : `<div class="project-nav-btn flex items-center gap-2 px-4 sm:px-6 py-3 bg-white/5 rounded-lg font-medium cursor-not-allowed opacity-50" style="color: var(--text-muted);">
                  <span class="hidden sm:inline">Next</span>
                  <i class="fas fa-chevron-right"></i>
                </div>`
            }
          </div>
        </div>
      </div>
    `;

    // Find insertion point (after main content starts or before first section)
    const main = document.querySelector('main');
    if (main) {
      const firstSection = main.querySelector('section');
      if (firstSection) {
        firstSection.insertAdjacentHTML('beforebegin', navHTML);
      } else {
        main.insertAdjacentHTML('afterbegin', navHTML);
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }

  // Export for external use
  window.ProjectNavigation = {
    getCurrentProjectId: getCurrentProjectId,
    getNavigationInfo: getNavigationInfo,
    projectSequence: projectSequence
  };

})();
