import client from './client';

export const createRazorpayOrder = async (amount, receipt) => {
    const response = await client.post('/payments/create-order', { amount, receipt });
    return response.data;
};

export const makeRazorpayPayment = async (orderId, milestoneId, customerId, plantAdminId, plantId, quotationId, amount) => {
    const response = await client.post('/payments/make-payment', { 
        orderId, 
        milestoneId, 
        customerId, 
        plantAdminId,
        plantId,
        quotationId,
        amount 
    });
    return response.data;
};

export const verifyRazorpayPayment = async (orderId, paymentId, signature) => {
    const response = await client.post('/payments/verify', { orderId, paymentId, signature });
    return response.data;
};

export const getCustomerPayments = async (customerId) => {
    const response = await client.get(`/payments/customer-payments/${customerId}`);
    return response.data;
};

export const getPlantPayments = async () => {
    const response = await client.get('/payments/plant-payments');
    return response.data;
};
