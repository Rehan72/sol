import client from './client';

// Create a new plant
export const createPlant = async (plantData) => {
    const response = await client.post('/plant', plantData);
    return response.data;
};

// Get all plants
export const getAllPlants = async () => {
    const response = await client.get('/plant');
    return response.data;
};

// Get plant statistics
export const getPlantStatistics = async () => {
    const response = await client.get('/plant/statistics');
    return response.data;
};

// Get plant by ID
export const getPlantById = async (id) => {
    const response = await client.get(`/plant/${id}`);
    return response.data;
};

// Update plant
export const updatePlant = async (id, plantData) => {
    const response = await client.patch(`/plant/${id}`, plantData);
    return response.data;
};

// Delete plant
export const deletePlant = async (id) => {
    const response = await client.delete(`/plant/${id}`);
    return response.data;
};
