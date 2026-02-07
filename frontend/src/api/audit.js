import API from './client';

export const getAuditLogs = async (params) => {
    const query = new URLSearchParams(params).toString();
    const response = await API.get(`/audit?${query}`);
    return response.data;
};
