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

export const advanceWorkflowPhase = async (customerId, nextPhase) => {
    const response = await API.post(`/workflow/advance/${customerId}`, { phase: nextPhase });
    return response.data;
};

export const markInstallationComplete = async (customerId) => {
    const response = await API.post(`/workflow/installation-complete`, { customerId });
    return response.data;
};

export const resetWorkflow = async (customerId) => {
    const response = await API.post(`/workflow/reset/${customerId}`);
    return response.data;
};

export const requestQC = async (customerId) => {
    const response = await API.post(`/workflow/request-qc`, { customerId });
    return response.data;
};

export const approveQC = async (customerId) => {
    const response = await API.post(`/workflow/approve-qc`, { customerId });
    return response.data;
};

export const rejectQC = async (customerId, reason) => {
    const response = await API.post(`/workflow/reject-qc`, { customerId, reason });
    return response.data;
};

export const assignInstallationTeam = async (customerId, teamId, adminId) => {
    const response = await API.post(`/workflow/assign-team`, { customerId, teamId, adminId });
    return response.data;
};
