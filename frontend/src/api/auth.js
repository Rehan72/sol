import client from './client';

export const login = async (credentials) => {
  const response = await client.post('/auth/login', credentials);
  return response.data;
};

export const register = async (data) => {
  const response = await client.post('/auth/register', data);
  return response.data;
};

export const logout = async () => {
  try {
    await client.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed', error);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};
