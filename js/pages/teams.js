import { API } from '../api.js';
import { UI } from '../utils.js';

export async function renderTeams(container) {
    const { data: teams, error } = await API.getTeams();
    
    if (error) {
        container.innerHTML = `<div class="alert alert-danger">Error loading teams.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2><i class="bi bi-people text-primary me-2"></i> Teams Management</h2>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTeamModal">
                <i class="bi bi-plus-circle me-1"></i> Add Team
            </button>
        </div>

        <div class="card">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0">All Teams</h5>
                <div class="input-group" style="max-width: 300px;">
                    <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                    <input type="text" id="teamSearchInput" class="form-control border-start-0 ps-0" placeholder="Search teams...">
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" id="teamsTable">
                        <thead class="table-light">
                            <tr>
                                <th>Team Name</th>
                                <th>Code</th>
                                <th>Registration Date</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teams && teams.length > 0 ? teams.map(team => `
                                <tr>
                                    <td class="fw-bold">${team.name}</td>
                                    <td>${team.team_code || '-'}</td>
                                    <td>${new Date(team.created_at).toLocaleDateString()}</td>
                                    <td class="text-end">
                                        <a href="#/team/${team.id}" class="btn btn-sm btn-outline-primary"><i class="bi bi-eye"></i> Details</a>
                                        <button class="btn btn-sm btn-outline-danger ms-1 delete-team-btn" data-id="${team.id}" data-name="${team.name}"><i class="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="4" class="text-center py-4 text-muted">No teams found. Add a team to get started.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add Team Modal -->
        <div class="modal fade" id="addTeamModal" tabindex="-1" aria-labelledby="addTeamModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addTeamModalLabel">Register New Team</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="addTeamForm">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="teamName" class="form-label">Team Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="teamName" required>
                            </div>
                            <div class="mb-3">
                                <label for="teamCode" class="form-label">Team Code (Optional)</label>
                                <input type="text" class="form-control" id="teamCode">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="saveTeamBtn">Save Team</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Search functionality
    const searchInput = document.getElementById('teamSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#teamsTable tbody tr');
            rows.forEach(row => {
                if (row.cells.length > 1) { // Skip "No teams found" row
                    const name = row.cells[0].textContent.toLowerCase();
                    const code = row.cells[1].textContent.toLowerCase();
                    if (name.includes(term) || code.includes(term)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // Add Team Form Submission
    const addTeamForm = document.getElementById('addTeamForm');
    const addTeamModalEl = document.getElementById('addTeamModal');
    let addTeamModal;
    if (addTeamModalEl) {
        addTeamModal = new bootstrap.Modal(addTeamModalEl);
    }

    if (addTeamForm) {
        addTeamForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('teamName').value.trim();
            const team_code = document.getElementById('teamCode').value.trim();

            if (!name) {
                UI.showToast('Error', 'Team name is required.', 'danger');
                return;
            }

            UI.setButtonLoading('saveTeamBtn', true);
            
            const { data, error } = await API.createTeam({ name, team_code });
            
            UI.setButtonLoading('saveTeamBtn', false, 'Save Team');

            if (error) {
                UI.showToast('Error', 'Failed to create team. It might already exist.', 'danger');
            } else {
                UI.showToast('Success', 'Team created successfully.', 'success');
                addTeamModal.hide();
                // Refresh the page
                window.dispatchEvent(new Event('hashchange'));
            }
        });
    }

    // Delete Team
    const deleteBtns = document.querySelectorAll('.delete-team-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const name = e.currentTarget.getAttribute('data-name');
            
            if (confirm(`Are you sure you want to delete team "${name}"? This will also delete all members and evaluations.`)) {
                const { error } = await API.deleteTeam(id);
                if (error) {
                    UI.showToast('Error', 'Failed to delete team.', 'danger');
                } else {
                    UI.showToast('Success', 'Team deleted successfully.', 'success');
                    window.dispatchEvent(new Event('hashchange'));
                }
            }
        });
    });
}
