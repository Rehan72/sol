import client from './client';

export const createSurvey = async (data) => {
    const response = await client.post('/surveys', data);
    return response.data;
};

export const getAllSurveys = async () => {
    const response = await client.get('/surveys');
    return response.data;
};

export const getSurveyById = async (id) => {
    const response = await client.get(`/surveys/${id}`);
    return response.data;
};

export const updateSurvey = async (id, data) => {
    const response = await client.put(`/surveys/${id}`, data);
    return response.data;
};

export const completeSurvey = async (id) => {
    const response = await client.post(`/surveys/${id}/complete`);
    return response.data;
};
