import { API } from '../api.js';
import { ExportHelper } from '../utils.js';

export async function renderRankings(container) {
    const { data: rankings, error } = await API.getRankings();

    if (error) {
        container.innerHTML = `<div class="alert alert-danger">Error loading rankings.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2><i class="bi bi-list-ol text-primary me-2"></i> Team Rankings</h2>
            <button class="btn btn-success" id="exportCsvBtn" ${!rankings || rankings.length === 0 ? 'disabled' : ''}>
                <i class="bi bi-file-earmark-excel me-1"></i> Export to CSV
            </button>
        </div>

        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0 text-center">
                        <thead class="table-dark">
                            <tr>
                                <th class="py-3" style="width: 100px;">Rank</th>
                                <th class="py-3 text-start">Team Name</th>
                                <th class="py-3" style="width: 150px;">Total Score</th>
                                <th class="py-3" style="width: 150px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rankings && rankings.length > 0 ? rankings.map((team, index) => {
                                let rankClass = 'rank-other';
                                if (index === 0) rankClass = 'rank-1';
                                else if (index === 1) rankClass = 'rank-2';
                                else if (index === 2) rankClass = 'rank-3';

                                return `
                                <tr class="${index < 3 ? 'fw-bold' : ''}">
                                    <td>
                                        <div class="d-flex justify-content-center">
                                            <span class="rank-badge ${rankClass}">${index + 1}</span>
                                        </div>
                                    </td>
                                    <td class="text-start fs-5">${team.name}</td>
                                    <td>
                                        <span class="badge ${index < 3 ? 'bg-primary' : 'bg-secondary'} rounded-pill fs-5 px-3 py-2">
                                            ${team.total_score}
                                        </span>
                                    </td>
                                    <td>
                                        <a href="#/team/${team.id}" class="btn btn-sm btn-outline-primary"><i class="bi bi-eye"></i> View</a>
                                    </td>
                                </tr>
                                `;
                            }).join('') : '<tr><td colspan="4" class="py-5 text-muted">No evaluations found.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Export functionality
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn && rankings && rankings.length > 0) {
        exportBtn.addEventListener('click', () => {
            const exportData = rankings.map((r, i) => ({
                Rank: i + 1,
                'Team Name': r.name,
                'Total Score': r.total_score
            }));
            
            const dateStr = new Date().toISOString().split('T')[0];
            ExportHelper.downloadCSV(exportData, `Hackathon_Rankings_${dateStr}.csv`);
        });
    }
}
