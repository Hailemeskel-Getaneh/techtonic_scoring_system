import { supabase } from './supabaseClient.js';

// In-memory mock data for when Supabase is not configured
let mockTeams = [
    { id: '1', name: 'Code Masters', team_code: 'CM01', created_at: new Date().toISOString() },
    { id: '2', name: 'ByteForce', team_code: 'BF02', created_at: new Date().toISOString() }
];

let mockMembers = [
    { id: '1', team_id: '1', full_name: 'Alice Smith', student_id: 'S1001', phone: '123456789' },
    { id: '2', team_id: '1', full_name: 'Bob Jones', student_id: 'S1002', phone: '987654321' }
];

let mockEvaluations = [
    { 
        id: '1', team_id: '1', 
        program_runs: 5, functions: 5, loops: 5, menu_design: 3, delete_feature: 5,
        total_score: 92, judge_note: 'Excellent work!'
    }
];

export const API = {
    isMock: !supabase,

    // Teams API
    async getTeams() {
        if (this.isMock) return { data: mockTeams, error: null };
        return await supabase.from('teams').select('*').order('created_at', { ascending: false });
    },

    async getTeamById(id) {
        if (this.isMock) return { data: mockTeams.find(t => t.id === id), error: null };
        const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();
        return { data, error };
    },

    async createTeam(teamData) {
        if (this.isMock) {
            const newTeam = { id: Date.now().toString(), ...teamData, created_at: new Date().toISOString() };
            mockTeams.push(newTeam);
            return { data: [newTeam], error: null };
        }
        return await supabase.from('teams').insert([teamData]).select();
    },

    async deleteTeam(id) {
        if (this.isMock) {
            mockTeams = mockTeams.filter(t => t.id !== id);
            mockMembers = mockMembers.filter(m => m.team_id !== id);
            mockEvaluations = mockEvaluations.filter(e => e.team_id !== id);
            return { error: null };
        }
        return await supabase.from('teams').delete().eq('id', id);
    },

    // Members API
    async getMembersByTeam(teamId) {
        if (this.isMock) return { data: mockMembers.filter(m => m.team_id === teamId), error: null };
        return await supabase.from('members').select('*').eq('team_id', teamId);
    },

    async addMember(memberData) {
        if (this.isMock) {
            const newMember = { id: Date.now().toString(), ...memberData };
            mockMembers.push(newMember);
            return { data: [newMember], error: null };
        }
        return await supabase.from('members').insert([memberData]).select();
    },

    async deleteMember(id) {
        if (this.isMock) {
            mockMembers = mockMembers.filter(m => m.id !== id);
            return { error: null };
        }
        return await supabase.from('members').delete().eq('id', id);
    },

    // Evaluations API
    async getEvaluationByTeam(teamId) {
        if (this.isMock) return { data: mockEvaluations.find(e => e.team_id === teamId), error: null };
        return await supabase.from('evaluations').select('*').eq('team_id', teamId).maybeSingle();
    },

    async saveEvaluation(evaluationData) {
        if (this.isMock) {
            const existingIndex = mockEvaluations.findIndex(e => e.team_id === evaluationData.team_id);
            if (existingIndex >= 0) {
                mockEvaluations[existingIndex] = { ...mockEvaluations[existingIndex], ...evaluationData };
            } else {
                mockEvaluations.push({ id: Date.now().toString(), ...evaluationData });
            }
            return { error: null };
        }
        // Use upsert based on team_id
        return await supabase.from('evaluations').upsert(evaluationData, { onConflict: 'team_id' });
    },

    // Dashboard & Rankings API
    async getRankings() {
        if (this.isMock) {
            const rankings = mockTeams.map(team => {
                const evalData = mockEvaluations.find(e => e.team_id === team.id);
                return {
                    id: team.id,
                    name: team.name,
                    total_score: evalData ? evalData.total_score : 0
                };
            }).sort((a, b) => b.total_score - a.total_score);
            return { data: rankings, error: null };
        }

        // Fetch teams and their evaluations
        const { data: teams, error: teamsError } = await supabase.from('teams').select('id, name');
        if (teamsError) return { data: null, error: teamsError };

        const { data: evaluations, error: evalError } = await supabase.from('evaluations').select('team_id, total_score');
        if (evalError) return { data: null, error: evalError };

        const rankings = teams.map(team => {
            const evalData = evaluations.find(e => e.team_id === team.id);
            return {
                id: team.id,
                name: team.name,
                total_score: evalData ? evalData.total_score : 0
            };
        }).sort((a, b) => b.total_score - a.total_score);

        return { data: rankings, error: null };
    }
};
