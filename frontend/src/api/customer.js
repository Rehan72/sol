import API from './client';

export const getCustomerProfile = async () => {
  const response = await API.get('/customer/profile');
  return response.data;
};
