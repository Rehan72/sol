import client from './client';

export const createQuotation = async (data) => {
    const response = await client.post('/quotations', data);
    return response.data;
};

export const getAllQuotations = async () => {
    const response = await client.get('/quotations');
    return response.data;
};

export const getQuotationById = async (id) => {
    const response = await client.get(`/quotations/${id}`);
    return response.data;
};

export const updateQuotation = async (id, data) => {
    const response = await client.put(`/quotations/${id}`, data);
    return response.data;
};

export const submitQuotation = async (id) => {
    const response = await client.post(`/quotations/${id}/submit`);
    return response.data;
};

export const approveQuotation = async (id, remarks) => {
    const response = await client.post(`/quotations/${id}/approve`, { remarks });
    return response.data;
};

export const rejectQuotation = async (id, remarks) => {
    const response = await client.post(`/quotations/${id}/reject`, { remarks });
    return response.data;
};

export const generateQuotationPdf = async (id) => {
    const response = await client.get(`/quotations/${id}/pdf`);
    return response.data; // Expecting { base64: ..., filename: ... }
};
export const finalApproveQuotation = async (id) => {
    const response = await client.post(`/quotations/${id}/final-approve`);
    return response.data;
};
