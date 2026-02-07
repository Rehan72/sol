import client from './client';

export const createPlantAdmin = async (data) => {
    const response = await client.post('/plant-admin', data);
    return response.data;
};

export const getAllPlantAdmins = async () => {
    const response = await client.get('/plant-admin');
    return response.data;
};

export const getPlantAdminStats = async () => {
    const response = await client.get('/plant-admin/statistics');
    return response.data;
};

export const getPlantAdminById = async (id) => {
    const response = await client.get(`/plant-admin/${id}`);
    return response.data;
};

export const updatePlantAdmin = async (id, data) => {
    const response = await client.patch(`/plant-admin/${id}`, data);
    return response.data;
};

export const deletePlantAdmin = async (id) => {
    const response = await client.delete(`/plant-admin/${id}`);
    return response.data;
};
