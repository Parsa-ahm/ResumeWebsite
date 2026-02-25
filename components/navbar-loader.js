/**
 * Navbar Loader
 * Dynamically loads navbar and sets correct paths and active states based on current page
 */

(function() {
  // Determine the base path based on current page location
  function getBasePath() {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(p => p && p !== 'index.html');
    
    // Count depth (how many directories deep we are)
    let depth = 0;
    if (path.includes('quantum-outlier-detection') ||
        path.includes('bogglesolver') ||
        path.includes('sudoku') ||
        path.includes('Simon') ||
        path.includes('COVID_Tracker') ||
        path.includes('ml-visualizer') ||
        path.includes('games') ||
        path.includes('resources')) {
      depth = 1;
    }
    
    return depth === 0 ? '' : '../';
  }

  // Get current page identifier
  function getCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('quantum') || path.includes('outlier')) return 'quantum';
    if (path.includes('boggle')) return 'boggle';
    if (path.includes('sudoku')) return 'sudoku';
    if (path.includes('simon')) return 'simon';
    if (path.includes('covid')) return 'covid';
    if (path.includes('ml-visualizer') || path.includes('ml') && path.includes('visualizer')) return 'ml-visualizer';
    if (path.includes('games')) return 'games';
    if (path.includes('resources')) return 'resources';
    return 'home';
  }

  // Navbar HTML template (embedded to avoid CORS issues with file:// protocol)
  function getNavbarHTML() {
    return `
<div class="nav fixed-top w-100">
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" id="nav-home" aria-current="page" href="">Home</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="nav-projects" href="#" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              Projects
            </a>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" id="nav-quantum" href="">Quantum Outlier Detection</a>
              </li>
              <li>
                <a class="dropdown-item" id="nav-covid" href="">COVID-19 Dashboard</a>
              </li>
              <li>
                <a class="dropdown-item" id="nav-ml-visualizer" href="">ML Algorithm Visualizer</a>
              </li>
              <li>
                <a class="dropdown-item" id="nav-games" href="">Games</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="nav-resources" href="">Resources</a>
          </li>
          <li class="nav-item">
            <a href="https://www.linkedin.com/in/parsa-ahmadizadeh-22087a321/" class="nav-link">
              <i class="fa fa-linkedin" style="font-size: 20px"></i>
            </a>
          </li>
          <li class="nav-item">
            <a href="https://github.com/Parsa-ahm" class="nav-link">
              <i class="fa fa-github" style="font-size: 20px"></i>
            </a>
          </li>
          <li class="nav-item">
            <a id="nav-resume" href="" target="_blank" class="nav-link">
              <i class="fa fa-file-text-o" style="font-size: 20px" title="View Resume"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
    `;
  }

  // Load and inject navbar
  function loadNavbar() {
    const basePath = getBasePath();
    
    // Create a container for the navbar
    const navbarContainer = document.createElement('div');
    navbarContainer.innerHTML = getNavbarHTML();
    
    // Insert navbar at the beginning of body
    document.body.insertBefore(navbarContainer.firstElementChild, document.body.firstChild);
    
    // Set paths and active states
    setupNavbar(basePath);
  }

  // Setup navbar paths and active states
  function setupNavbar(basePath) {
    const currentPage = getCurrentPage();
    
    // Set Home link
    const homeLink = document.getElementById('nav-home');
    if (homeLink) {
      homeLink.href = basePath + 'index.html';
      if (currentPage === 'home') {
        homeLink.classList.add('active');
        homeLink.setAttribute('aria-current', 'page');
      }
    }
    
    // Set Resources link
    const resourcesLink = document.getElementById('nav-resources');
    if (resourcesLink) {
      resourcesLink.href = basePath + 'resources/index.html';
      if (currentPage === 'resources') {
        resourcesLink.classList.add('active');
        resourcesLink.setAttribute('aria-current', 'page');
      }
    }

    // Set Project links
    const projectLinks = {
      'nav-quantum': 'quantum-outlier-detection/index.html',
      'nav-covid': 'COVID_Tracker/Covid_Tracker.html',
      'nav-ml-visualizer': 'ml-visualizer/index.html',
      'nav-games': 'games/index.html'
    };
    
    let isProjectPage = false;
    Object.keys(projectLinks).forEach(id => {
      const link = document.getElementById(id);
      if (link) {
        link.href = basePath + projectLinks[id];
        // Set active state for projects dropdown if on that project page
        const projectName = id.replace('nav-', '');
        if (currentPage === projectName) {
          isProjectPage = true;
        }
      }
    });
    
    // Mark Projects dropdown as active if on a project page
    if (isProjectPage) {
      const projectsDropdown = document.getElementById('nav-projects');
      if (projectsDropdown) {
        projectsDropdown.classList.add('active');
      }
    }
    
    // Set Resume link
    const resumeLink = document.getElementById('nav-resume');
    if (resumeLink) {
      resumeLink.href = basePath + 'assets/Resume.pdf';
    }
  }

  // Load navbar when DOM is ready
  function initNavbar() {
    // Ensure body exists
    if (!document.body) {
      setTimeout(initNavbar, 50);
      return;
    }
    
    // Wait a moment for any other scripts to load
    setTimeout(loadNavbar, 10);
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    // DOM already loaded
    initNavbar();
  }
})();

