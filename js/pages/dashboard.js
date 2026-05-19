import { API } from '../api.js';

export async function renderDashboard(container) {
    const { data: teams, error: teamsError } = await API.getTeams();
    const { data: rankings, error: rankingsError } = await API.getRankings();
    
    if (teamsError || rankingsError) {
        container.innerHTML = `<div class="alert alert-danger">Error loading dashboard data.</div>`;
        return;
    }

    const totalTeams = teams ? teams.length : 0;
    
    // Calculate stats from rankings
    let highestScore = 0;
    let totalScoreSum = 0;
    let topTeam = 'N/A';
    
    if (rankings && rankings.length > 0) {
        highestScore = rankings[0].total_score;
        topTeam = rankings[0].name;
        totalScoreSum = rankings.reduce((sum, r) => sum + r.total_score, 0);
    }
    
    const averageScore = totalTeams > 0 ? (totalScoreSum / totalTeams).toFixed(1) : 0;

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2><i class="bi bi-speedometer2 text-primary me-2"></i> Dashboard</h2>
            ${API.isMock ? '<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-triangle me-1"></i> Mock Mode (No DB)</span>' : '<span class="badge bg-success"><i class="bi bi-cloud-check me-1"></i> Connected to Supabase</span>'}
        </div>

        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title opacity-75">Total Teams</h5>
                        <h2 class="display-4 fw-bold mb-0">${totalTeams}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title opacity-75">Highest Score</h5>
                        <h2 class="display-4 fw-bold mb-0">${highestScore}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title opacity-75">Average Score</h5>
                        <h2 class="display-4 fw-bold mb-0">${averageScore}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-dark h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title opacity-75">Top Team</h5>
                        <h3 class="fw-bold mt-3 mb-0">${topTeam}</h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-clock-history me-2"></i> Recent Teams</span>
                        <a href="#/teams" class="btn btn-sm btn-outline-primary">View All</a>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush">
                            ${teams && teams.length > 0 ? teams.slice(0, 5).map(team => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <div class="fw-bold">${team.name}</div>
                                    </div>
                                    <a href="#/team/${team.id}" class="btn btn-sm btn-light"><i class="bi bi-chevron-right"></i></a>
                                </li>
                            `).join('') : '<li class="list-group-item text-muted text-center py-4">No teams registered yet.</li>'}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-trophy me-2"></i> Top Rankings</span>
                        <a href="#/rankings" class="btn btn-sm btn-outline-primary">View Leaderboard</a>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush">
                            ${rankings && rankings.length > 0 ? rankings.slice(0, 5).map((rank, index) => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center">
                                        <span class="rank-badge rank-${index + 1} me-3">${index + 1}</span>
                                        <span class="fw-bold">${rank.name}</span>
                                    </div>
                                    <span class="badge bg-primary rounded-pill fs-6">${rank.total_score} pts</span>
                                </li>
                            `).join('') : '<li class="list-group-item text-muted text-center py-4">No evaluations yet.</li>'}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}
