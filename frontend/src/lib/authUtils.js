export const getRedirectPath = (role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/dashboard';
    case 'REGION_ADMIN':
      return '/region-admin-dashboard';
    case 'PLANT_ADMIN':
      return '/plant-admin-dashboard';
    case 'PLANTS':
      return '/dashboard'; // Or a specific dashboard for GridPlant if one exists? Defaulting to main dashboard as allowed by route
    case 'INSTALLATION_TEAM':
      return '/installation-workflow';
    case 'CUSTOMER':
      return '/customer/setup';
    case 'EMPLOYEE':
      return '/employee-dashboard';
    default:
      return '/dashboard'; // Fallback
  }
};

export const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  } else {
    return {};
  }
};
