import API from './client';

export const getAuditLogs = async (params) => {
    const query = new URLSearchParams(params).toString();
    const response = await API.get(`/audit?${query}`);
    return response.data;
};

export const getDiscomReport = async () => {
    const response = await API.get('/audit/discom-report');
    return response.data;
};

export const getSubsidyReport = async () => {
    const response = await API.get('/audit/subsidy-report');
    return response.data;
};

export const getExpiringDocuments = async () => {
    const response = await API.get('/audit/expiring-documents');
    return response.data;
};

export const getESGReport = async () => {
    const response = await API.get('/audit/esg-report');
    return response.data;
};
