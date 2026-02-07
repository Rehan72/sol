import API from './client';

export const getCustomerProfile = async () => {
  const response = await API.get('/customer/profile');
  return response.data;
};

export const getSolarRequests = async () => {
  const response = await API.get('/customer/solar-requests');
  return response.data;
};

export const getAllCustomers = async () => {
  const response = await API.get('/customer');
  return response.data;
};

export const assignSurvey = async (customerId, teamId) => {
  const response = await API.post('/customer/assign-survey', { customerId, teamId });
  return response.data;
};
