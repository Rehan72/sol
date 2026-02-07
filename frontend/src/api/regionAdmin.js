import client from './client';

export const createRegionAdmin = async (data) => {
    const response = await client.post('/region-admin', data);
    return response.data;
};

export const getAllRegionAdmins = async () => {
    const response = await client.get('/region-admin');
    return response.data;
};

export const getRegionAdminStats = async () => {
    const response = await client.get('/region-admin/statistics');
    return response.data;
};

export const getRegionAdminById = async (id) => {
    const response = await client.get(`/region-admin/${id}`);
    return response.data;
};

export const updateRegionAdmin = async (id, data) => {
    const response = await client.patch(`/region-admin/${id}`, data);
    return response.data;
};

export const deleteRegionAdmin = async (id) => {
    const response = await client.delete(`/region-admin/${id}`);
    return response.data;
};
