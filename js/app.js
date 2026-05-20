/**
 * Main Application Entry Point and Hash Router
 */
import { Auth } from './auth.js';

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
                // Route Guard for Evaluations
                if (!Auth.isJudge()) {
                    const { UI } = await import('./utils.js');
                    UI.showToast('Unauthorized', 'Judge access required to evaluate teams.', 'danger');
                    window.location.hash = '#/';
                    return;
                }
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

    // Update navbar login/logout
    updateNavbar();
};

function updateNavbar() {
    const navbarNav = document.querySelector('#navbarNav ul');
    if (!navbarNav) return;

    let authLi = document.getElementById('nav-auth-item');
    if (!authLi) {
        authLi = document.createElement('li');
        authLi.className = 'nav-item ms-lg-3 mt-2 mt-lg-0';
        authLi.id = 'nav-auth-item';
        navbarNav.appendChild(authLi);
    }

    let viewOnlyBanner = document.getElementById('view-only-banner');

    if (Auth.isJudge()) {
        if (viewOnlyBanner) viewOnlyBanner.remove();
        authLi.innerHTML = `
            <button class="btn btn-outline-light btn-sm" id="navLogoutBtn">
                <i class="bi bi-box-arrow-right me-1"></i> Logout (Judge)
            </button>
        `;
        document.getElementById('navLogoutBtn').addEventListener('click', () => {
            Auth.logout();
            updateNavbar();
            window.location.hash = '#/';
            window.location.reload();
        });
    } else {
        if (!viewOnlyBanner) {
            viewOnlyBanner = document.createElement('div');
            viewOnlyBanner.id = 'view-only-banner';
            viewOnlyBanner.className = 'alert alert-info text-center m-0 border-0 rounded-0 shadow-sm py-2';
            viewOnlyBanner.innerHTML = `<i class="bi bi-eye me-2"></i> <strong>View-Only Mode:</strong> You are browsing as a guest. <a href="#" id="bannerLoginBtn" class="alert-link text-decoration-underline">Log in as Judge</a> to manage teams and evaluations.`;
            const mainContent = document.getElementById('app-content');
            if (mainContent) {
                document.body.insertBefore(viewOnlyBanner, mainContent);
            }
            const bannerLoginBtn = document.getElementById('bannerLoginBtn');
            if (bannerLoginBtn) {
                bannerLoginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showLoginModal();
                });
            }
        }
        authLi.innerHTML = `
            <button class="btn btn-warning btn-sm text-dark fw-bold" id="navLoginBtn">
                <i class="bi bi-key-fill me-1"></i> Judge Login
            </button>
        `;
        document.getElementById('navLoginBtn').addEventListener('click', showLoginModal);
    }
}

function showLoginModal() {
    const existingModal = document.getElementById('loginModal');
    if (existingModal) existingModal.remove();

    const modalHtml = `
        <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content shadow">
                    <div class="modal-header bg-primary text-white py-2">
                        <h5 class="modal-title" id="loginModalLabel"><i class="bi bi-shield-lock me-2"></i>Judge Auth</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="passcodeField" class="form-label fw-bold">Enter Judge Passcode</label>
                                <input type="password" class="form-control" id="passcodeField" required placeholder="Passcode" autocomplete="current-password">
                                <div class="invalid-feedback" id="loginFeedback">Incorrect passcode!</div>
                            </div>
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-sm"><i class="bi bi-box-arrow-in-right me-1"></i>Authenticate</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('loginModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();

    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const passcode = document.getElementById('passcodeField').value.trim();
        if (Auth.login(passcode)) {
            bsModal.hide();
            modalEl.remove();
            const { UI } = await import('./utils.js');
            UI.showToast('Access Granted', 'You are logged in as Judge.', 'success');
            updateNavbar();
            window.location.reload();
        } else {
            const field = document.getElementById('passcodeField');
            field.classList.add('is-invalid');
            field.focus();
        }
    });
}

// Listen for hash changes
window.addEventListener('hashchange', router);

// Initial load
window.addEventListener('DOMContentLoaded', router);
