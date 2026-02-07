import api from '../api/client';

const getAllCustomers = async () => {
    const response = await api.get('/customer');
    return response.data;
};

const assignSurveyTeam = async (customerId, teamName) => {
    const response = await api.post('/customer/assign-survey', { customerId, teamName });
    return response.data;
};

const getSolarRequests = async () => {
    const response = await api.get('/customer/solar-requests');
    return response.data;
};

const CustomerService = {
    getAllCustomers,
    assignSurveyTeam,
    getSolarRequests
};

export default CustomerService;
