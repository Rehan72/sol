import client from './client';

export const createCostEstimation = async (data) => {
    const response = await client.post('/cost-estimation', data);
    return response.data;
};

export const getAllCostEstimations = async () => {
    const response = await client.get('/cost-estimation');
    return response.data;
};

export const getCostEstimationById = async (id) => {
    const response = await client.get(`/cost-estimation/${id}`);
    return response.data;
};

export const updateCostEstimation = async (id, data) => {
    const response = await client.put(`/cost-estimation/${id}`, data);
    return response.data;
};

export const deleteCostEstimation = async (id) => {
    const response = await client.delete(`/cost-estimation/${id}`);
    return response.data;
};

export const finalizeCostEstimation = async (id) => {
    const response = await client.post(`/cost-estimation/${id}/finalize`);
    return response.data;
};

export const generateQuotationFromEstimation = async (id) => {
    const response = await client.post(`/quotations/generate-from-estimation/${id}`);
    return response.data;
};

export const generateCostEstimation = async (surveyId) => {
    const response = await client.post(`/cost-estimation/generate-from-survey/${surveyId}`);
    return response.data;
};
