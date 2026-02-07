import API from './client';

export const getTeams = async (params) => {
    const response = await API.get('/teams', { params });
    return response.data;
};

export const getTeamById = async (id) => {
    const response = await API.get(`/teams/${id}`);
    return response.data;
};
