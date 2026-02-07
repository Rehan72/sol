export const getRedirectPath = (role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/dashboard';
    case 'REGION_ADMIN':
      return '/grid-plant';
    case 'PLANT_ADMIN':
      return '/plant-admin-dashboard';
    case 'INSTALLATION_TEAM':
      return '/installation-workflow';
    case 'CUSTOMER':
      return '/customer/setup';
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
