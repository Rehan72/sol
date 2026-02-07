import api from '../api/client';

const getAllEmployees = async () => {
    const response = await api.get('/employees');
    return response.data;
};

const getEmployeeById = async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};

const createEmployee = async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
};

const updateEmployee = async (id, employeeData) => {
    const response = await api.patch(`/employees/${id}`, employeeData);
    return response.data;
};

const deleteEmployee = async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
};

const EmployeeService = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};

export default EmployeeService;
