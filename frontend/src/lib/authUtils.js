export const getRedirectPath = (role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/dashboard';
    case 'REGION_ADMIN':
      return '/grid-plant';
    case 'PLANT_ADMIN':
      return '/installation-workflow';
    case 'INSTALLATION_TEAM':
      return '/installation-workflow';
    case 'CUSTOMER':
      return '/customer/setup';
    default:
      return '/dashboard'; // Fallback
  }
};
