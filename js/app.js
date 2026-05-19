/**
 * Main Application Entry Point and Hash Router
 */

const appContent = document.getElementById('app-content');

// Simple Router
const router = async () => {
    const hash = window.location.hash || '#/';
    appContent.innerHTML = `<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div></div>`;

    try {
        if (hash === '#/') {
            const { renderDashboard } = await import('./pages/dashboard.js');
            await renderDashboard(appContent);
        } else if (hash === '#/teams') {
            const { renderTeams } = await import('./pages/teams.js');
            await renderTeams(appContent);
        } else if (hash.startsWith('#/team/')) {
            const id = hash.split('/')[2];
            if (hash.includes('/evaluate')) {
                const { renderEvaluation } = await import('./pages/evaluation.js');
                await renderEvaluation(appContent, id);
            } else {
                const { renderTeamDetails } = await import('./pages/teamDetails.js');
                await renderTeamDetails(appContent, id);
            }
        } else if (hash === '#/rankings') {
            const { renderRankings } = await import('./pages/rankings.js');
            await renderRankings(appContent);
        } else {
            appContent.innerHTML = `<div class="alert alert-danger">Page not found.</div>`;
        }
    } catch (error) {
        console.error("Routing error:", error);
        appContent.innerHTML = `<div class="alert alert-danger">Error loading page: ${error.message}</div>`;
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash || (hash.startsWith('#/team') && link.getAttribute('href') === '#/teams')) {
            link.classList.add('active');
        }
    });
};

// Listen for hash changes
window.addEventListener('hashchange', router);

// Initial load
window.addEventListener('DOMContentLoaded', router);
