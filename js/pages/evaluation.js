import { API } from '../api.js';
import { UI } from '../utils.js';

export async function renderEvaluation(container, teamId) {
    const [teamResult, evalResult] = await Promise.all([
        API.getTeamById(teamId),
        API.getEvaluationByTeam(teamId)
    ]);

    if (teamResult.error || !teamResult.data) {
        container.innerHTML = `<div class="alert alert-danger">Team not found.</div>`;
        return;
    }

    const team = teamResult.data;
    const evaluation = evalResult.data || {};

    const getVal = (field) => evaluation[field] || 0;

    container.innerHTML = `
        <div class="mb-3">
            <a href="#/team/${team.id}" class="text-decoration-none"><i class="bi bi-arrow-left"></i> Back to Team</a>
        </div>
        
        <h2 class="mb-4"><i class="bi bi-clipboard-check text-warning me-2"></i> Evaluate: <span class="text-primary">${team.name}</span></h2>
        
        <form id="evaluationForm">
            <div class="row">
                <div class="col-md-8">
                    <!-- A. Program Execution & Correctness (40 points) -->
                    <div class="card mb-4 border-primary">
                        <div class="card-header bg-primary text-white">
                            A. Program Execution & Correctness (Max 40)
                            <span class="float-end fw-bold" id="scoreA">0</span>
                        </div>
                        <div class="card-body">
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Program runs correctly</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-a" name="program_runs" value="${getVal('program_runs')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Add Student Feature</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-a" name="add_student" value="${getVal('add_student')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Display Students</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-a" name="display_students" value="${getVal('display_students')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Search Student</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-a" name="search_student" value="${getVal('search_student')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Update Student</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-a" name="update_student" value="${getVal('update_student')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Class Average</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-a" name="class_average" value="${getVal('class_average')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Top Student</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-a" name="top_student" value="${getVal('top_student')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Pass/Fail Statistics</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-a" name="pass_fail" value="${getVal('pass_fail')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- B. Organization (20 points) -->
                    <div class="card mb-4 border-info">
                        <div class="card-header bg-info text-white">
                            B. Code Organization & Functions (Max 20)
                            <span class="float-end fw-bold" id="scoreB">0</span>
                        </div>
                        <div class="card-body">
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Proper function usage</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-b" name="functions" value="${getVal('functions')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Clean code</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-b" name="clean_code" value="${getVal('clean_code')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Indentation & formatting</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-b" name="formatting" value="${getVal('formatting')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Meaningful naming</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-b" name="naming" value="${getVal('naming')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- C. Logic & Problem Solving (20 points) -->
                    <div class="card mb-4 border-warning">
                        <div class="card-header bg-warning text-dark">
                            C. Logic & Problem Solving (Max 20)
                            <span class="float-end fw-bold" id="scoreC">0</span>
                        </div>
                        <div class="card-body">
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Proper loops</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-c" name="loops" value="${getVal('loops')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Correct conditions</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-c" name="conditions" value="${getVal('conditions')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Array handling</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-c" name="arrays" value="${getVal('arrays')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Edge case handling</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-c" name="edge_cases" value="${getVal('edge_cases')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- D. UX/UI (10 points) -->
                    <div class="card mb-4 border-secondary">
                        <div class="card-header bg-secondary text-white">
                            D. User Experience & Interface (Max 10)
                            <span class="float-end fw-bold" id="scoreD">0</span>
                        </div>
                        <div class="card-body">
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Clear menu design</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-d" name="menu_design" value="${getVal('menu_design')}" min="0" max="3">
                                        <span class="input-group-text">/ 3</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Output formatting</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-d" name="output_format" value="${getVal('output_format')}" min="0" max="3">
                                        <span class="input-group-text">/ 3</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Helpful messages</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-d" name="helpful_messages" value="${getVal('helpful_messages')}" min="0" max="2">
                                        <span class="input-group-text">/ 2</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Invalid input handling</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-d" name="invalid_input" value="${getVal('invalid_input')}" min="0" max="2">
                                        <span class="input-group-text">/ 2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- E. Bonus (Max 10 points) -->
                    <div class="card mb-4 border-success">
                        <div class="card-header bg-success text-white">
                            E. Bonus Features (Cap at 10)
                            <span class="float-end fw-bold" id="scoreE">0</span>
                        </div>
                        <div class="card-body">
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Delete Student</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-e" name="delete_feature" value="${getVal('delete_feature')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Sorting Students</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-e" name="sorting" value="${getVal('sorting')}" min="0" max="5">
                                        <span class="input-group-text">/ 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Grade System</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-e" name="grade_system" value="${getVal('grade_system')}" min="0" max="3">
                                        <span class="input-group-text">/ 3</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Duplicate Validation</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-e" name="duplicate_validation" value="${getVal('duplicate_validation')}" min="0" max="3">
                                        <span class="input-group-text">/ 3</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row eval-row align-items-center">
                                <div class="col-8">Partial Search</div>
                                <div class="col-4">
                                    <div class="input-group">
                                        <input type="number" class="form-control score-input group-e" name="partial_search" value="${getVal('partial_search')}" min="0" max="3">
                                        <span class="input-group-text">/ 3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <!-- Final Score Summary -->
                    <div class="card mb-4 shadow-sm" style="position: sticky; top: 80px;">
                        <div class="card-header bg-dark text-white text-center">
                            <h4 class="mb-0">Final Score</h4>
                        </div>
                        <div class="card-body text-center">
                            <h1 class="display-1 fw-bold text-primary mb-3" id="finalScoreDisplay">0</h1>
                            <p class="text-muted">out of 100</p>
                            
                            <hr>
                            
                            <div class="mb-3 text-start">
                                <label for="judgeNote" class="form-label fw-bold">Judge Notes</label>
                                <textarea class="form-control" id="judgeNote" rows="4" placeholder="Enter feedback here...">${evaluation.judge_note || ''}</textarea>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary btn-lg" id="saveEvalBtn">
                                    <i class="bi bi-save me-1"></i> Save Evaluation
                                </button>
                                <button type="button" class="btn btn-outline-secondary" onclick="window.history.back()">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `;

    // Calculation Logic
    const calculateScores = () => {
        let total = 0;

        // Helper to sum inputs by class
        const sumGroup = (className, cap = Infinity) => {
            const inputs = document.querySelectorAll(`.${className}`);
            let sum = 0;
            inputs.forEach(input => {
                let val = parseInt(input.value) || 0;
                // Enforce max
                const max = parseInt(input.max);
                if (val > max) { val = max; input.value = max; }
                if (val < 0) { val = 0; input.value = 0; }
                sum += val;
            });
            return Math.min(sum, cap);
        };

        const scoreA = sumGroup('group-a');
        document.getElementById('scoreA').textContent = scoreA;
        total += scoreA;

        const scoreB = sumGroup('group-b');
        document.getElementById('scoreB').textContent = scoreB;
        total += scoreB;

        const scoreC = sumGroup('group-c');
        document.getElementById('scoreC').textContent = scoreC;
        total += scoreC;

        const scoreD = sumGroup('group-d');
        document.getElementById('scoreD').textContent = scoreD;
        total += scoreD;

        // Bonus is capped at 10
        const scoreE = sumGroup('group-e', 10);
        document.getElementById('scoreE').textContent = scoreE;
        total += scoreE;

        // Final Cap at 100
        const finalScore = Math.min(total, 100);
        document.getElementById('finalScoreDisplay').textContent = finalScore;
        
        return finalScore;
    };

    // Attach listeners
    const inputs = document.querySelectorAll('.score-input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateScores);
        input.addEventListener('change', calculateScores);
    });

    // Initial calculation
    calculateScores();

    // Save
    const form = document.getElementById('evaluationForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        UI.setButtonLoading('saveEvalBtn', true);

        const finalScore = calculateScores(); // Ensure latest is grabbed
        
        const evalData = {
            team_id: teamId,
            total_score: finalScore,
            judge_note: document.getElementById('judgeNote').value.trim()
        };

        // Gather all inputs
        inputs.forEach(input => {
            evalData[input.name] = parseInt(input.value) || 0;
        });

        const { error } = await API.saveEvaluation(evalData);
        UI.setButtonLoading('saveEvalBtn', false, '<i class="bi bi-save me-1"></i> Save Evaluation');

        if (error) {
            UI.showToast('Error', 'Failed to save evaluation.', 'danger');
            console.error(error);
        } else {
            UI.showToast('Success', 'Evaluation saved successfully!', 'success');
            // Go to rankings or back to team
            setTimeout(() => {
                window.location.hash = '#/team/' + teamId;
            }, 1000);
        }
    });
}
