import API from './client';

export const getWorkflow = async (customerId) => {
    const response = await API.get(`/workflow/${customerId}`);
    return response.data;
};

export const updateWorkflowStep = async (stepId, data) => {
    const response = await API.put(`/workflow/step/${stepId}`, data);
    return response.data;
};

export const initWorkflow = async (customerId) => {
    const response = await API.post(`/workflow/init/${customerId}`);
    return response.data;
};
