import api from '../api/client';

const TeamService = {
    createTeam: async (teamData) => {
        const response = await api.post('/teams', teamData);
        return response.data;
    },

    getTeams: async (type) => {
        const response = await api.get(`/teams?type=${type}`);
        return response.data;
    },

    getTeamById: async (id) => {
        const response = await api.get(`/teams/${id}`);
        return response.data;
    },

    updateTeam: async (id, teamData) => {
        const response = await api.patch(`/teams/${id}`, teamData);
        return response.data;
    },

    deleteTeam: async (id) => {
        const response = await api.delete(`/teams/${id}`);
        return response.data;
    }
};

export default TeamService;
