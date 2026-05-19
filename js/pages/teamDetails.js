import { API } from '../api.js';
import { UI } from '../utils.js';

export async function renderTeamDetails(container, teamId) {
    // Fetch team and members
    const [teamResult, membersResult] = await Promise.all([
        API.getTeamById(teamId),
        API.getMembersByTeam(teamId)
    ]);

    if (teamResult.error || !teamResult.data) {
        container.innerHTML = `<div class="alert alert-danger">Team not found or error loading team details.</div>
                               <a href="#/teams" class="btn btn-outline-primary">Back to Teams</a>`;
        return;
    }

    const team = teamResult.data;
    const members = membersResult.data || [];

    // Check if evaluation exists
    const { data: evaluation } = await API.getEvaluationByTeam(teamId);
    const scoreBadge = evaluation ? `<span class="badge bg-success fs-6 ms-3">Score: ${evaluation.total_score}</span>` : `<span class="badge bg-secondary fs-6 ms-3">Not Evaluated Yet</span>`;

    container.innerHTML = `
        <div class="mb-4">
            <a href="#/teams" class="text-decoration-none"><i class="bi bi-arrow-left"></i> Back to Teams</a>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>
                <i class="bi bi-person-badge text-primary me-2"></i> ${team.name}
                ${scoreBadge}
            </h2>
            <a href="#/team/${team.id}/evaluate" class="btn btn-warning fw-bold">
                <i class="bi bi-clipboard-check me-1"></i> ${evaluation ? 'Edit Evaluation' : 'Evaluate Team'}
            </a>
        </div>

        <div class="row">
            <!-- Team Info Card -->
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-header">Team Information</div>
                    <div class="card-body">
                        <p><strong>Code:</strong> ${team.team_code || 'N/A'}</p>
                        <p><strong>Registered:</strong> ${new Date(team.created_at).toLocaleDateString()}</p>
                        <p><strong>Total Members:</strong> ${members.length}</p>
                    </div>
                </div>
            </div>

            <!-- Members Card -->
            <div class="col-md-8 mb-4">
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Members</span>
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addMemberModal">
                            <i class="bi bi-person-plus me-1"></i> Add Member
                        </button>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Student ID</th>
                                        <th>Phone</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${members.length > 0 ? members.map(m => `
                                        <tr>
                                            <td class="fw-bold">${m.full_name}</td>
                                            <td>${m.student_id || '-'}</td>
                                            <td>${m.phone || '-'}</td>
                                            <td class="text-end">
                                                <button class="btn btn-sm btn-outline-danger delete-member-btn" data-id="${m.id}" data-name="${m.full_name}"><i class="bi bi-trash"></i></button>
                                            </td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="4" class="text-center py-4 text-muted">No members added yet.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Member Modal -->
        <div class="modal fade" id="addMemberModal" tabindex="-1" aria-labelledby="addMemberModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addMemberModalLabel">Add Team Member</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="addMemberForm">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="memberName" class="form-label">Full Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="memberName" required>
                            </div>
                            <div class="mb-3">
                                <label for="memberId" class="form-label">Student ID (Optional)</label>
                                <input type="text" class="form-control" id="memberId">
                            </div>
                            <div class="mb-3">
                                <label for="memberPhone" class="form-label">Phone (Optional)</label>
                                <input type="text" class="form-control" id="memberPhone">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="saveMemberBtn">Add Member</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Add Member form handler
    const addMemberForm = document.getElementById('addMemberForm');
    const addMemberModalEl = document.getElementById('addMemberModal');
    let addMemberModal;
    if (addMemberModalEl) {
        addMemberModal = new bootstrap.Modal(addMemberModalEl);
    }

    if (addMemberForm) {
        addMemberForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const full_name = document.getElementById('memberName').value.trim();
            const student_id = document.getElementById('memberId').value.trim();
            const phone = document.getElementById('memberPhone').value.trim();

            if (!full_name) {
                UI.showToast('Error', 'Name is required', 'danger');
                return;
            }

            UI.setButtonLoading('saveMemberBtn', true);
            const { error } = await API.addMember({ team_id: teamId, full_name, student_id, phone });
            UI.setButtonLoading('saveMemberBtn', false, 'Add Member');

            if (error) {
                UI.showToast('Error', 'Failed to add member.', 'danger');
            } else {
                UI.showToast('Success', 'Member added successfully.', 'success');
                addMemberModal.hide();
                // Refresh to show new member
                renderTeamDetails(container, teamId);
            }
        });
    }

    // Delete Member
    const deleteBtns = document.querySelectorAll('.delete-member-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const memberId = e.currentTarget.getAttribute('data-id');
            const name = e.currentTarget.getAttribute('data-name');
            
            if (confirm(`Remove ${name} from this team?`)) {
                const { error } = await API.deleteMember(memberId);
                if (error) {
                    UI.showToast('Error', 'Failed to remove member.', 'danger');
                } else {
                    UI.showToast('Success', 'Member removed.', 'success');
                    renderTeamDetails(container, teamId);
                }
            }
        });
    });
}
