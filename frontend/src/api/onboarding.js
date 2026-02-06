import client from './client';

export const onboardCustomer = async (onboardingData) => {
    const response = await client.post('/customer/customerOnboarding', onboardingData);
    return response.data;
};
