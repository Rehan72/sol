import API from './client';

export const getInventory = async (warehouseId) => {
    const query = warehouseId ? `?warehouseId=${warehouseId}` : '';
    const response = await API.get(`/inventory/items${query}`);
    return response.data;
};

export const getWarehouses = async () => {
    const response = await API.get('/inventory/warehouses');
    return response.data;
};

export const createWarehouse = async (data) => {
    const response = await API.post('/inventory/warehouses', data);
    return response.data;
};

export const createInventoryItem = async (data) => {
    const response = await API.post('/inventory/items', data);
    return response.data;
};

export const updateStock = async (data) => {
    const response = await API.post('/inventory/update-stock', data);
    return response.data;
};

export const getStockTransactions = async (itemId) => {
    const query = itemId ? `?itemId=${itemId}` : '';
    const response = await API.get(`/inventory/transactions${query}`);
    return response.data;
};
