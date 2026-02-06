
import Dashboard from "../pages/superAdmin/Dashboard";
import CreatePlant from "../pages/plants/CreatePlant";
import PlantPayments from "../pages/plants/PlantPayments";
import PlantList from "../pages/plants/PlantList";
import RegionAdminList from "../pages/regionAdmin/RegionAdminList";
import CreateRegionAdmin from "../pages/regionAdmin/CreateRegionAdmin";
import CreatePlantAdmin from "../pages/plants/plantAdmin/CreatePlantAdmin";
import PlantAdminList from "../pages/plants/plantAdmin/PlantAdminList";
import CreateInstallationTeam from "../pages/installationTeam/CreateInstallationTeam";
import InstallationTeamDetail from "../pages/installationTeam/InstallationTeamDetail";
import SurveyTeamList from "../pages/surveyTeam/SurveyTeamList";
import CreateSurveyTeam from "../pages/surveyTeam/CreateSurveyTeam";
import SurveyTeamDetail from "../pages/surveyTeam/SurveyTeamDetail";
import InstallationWorkflow from "../pages/workflow/InstallationWorkflow";
import InstallationTeamList from "../pages/installationTeam/InstallationTeamList";
import HandoffReview from "../pages/workflow/HandoffReview";
import CommissioningHandoff from "../pages/workflow/CommissioningHandoff";
import AuditTrail from "../pages/audit/AuditTrail";
import CustomerOnboarding from "../pages/customer/CustomerOnboarding";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import SolarRequests from "../pages/admin/SolarRequests";
import CustomerList from "../pages/customer/CustomerList";
import CreateCustomer from "../pages/customer/CreateCustomer";
import CustomerPayments from "../pages/customer/CustomerPayments";


import CustomerInvoices from "../pages/customer/CustomerInvoices";
import CustomerBenefits from "../pages/customer/CustomerBenefits";
import CustomerCancellation from "../pages/customer/CustomerCancellation";
import PlantCancellation from "../pages/plants/PlantCancellation";

export const routeParams = "management";




export default [
   {
     element: Dashboard,
     path: `dashboard`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: RegionAdminList,
     path: `region-admin`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: CreateRegionAdmin,
     path: `region-admin/create`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: PlantList,
     path: `grid-plant`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: CreatePlant,
     path: `grid-plant/create`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: PlantPayments,
     path: `grid-plant/:id/payments`,
     exact: true
   },
   {
     element: PlantCancellation,
     path: `grid-plant/:id/cancellation`,
     exact: true
   },
   {
     element: PlantAdminList,
     path: `plant-admin`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: CreatePlantAdmin,
     path: `plant-admin/create`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: InstallationTeamList,
     path: `installation-teams`,
     exact: true
   },
   {
     element: CreateInstallationTeam,
     path: `installation-teams/create`,
     exact: true
   },
   {
     element: InstallationTeamDetail,
     path: `installation-teams/:id`,
     exact: true
   },
   {
     element: SurveyTeamList,
     path: `survey-teams`,
     exact: true
   },
   {
     element: CreateSurveyTeam,
     path: `survey-teams/create`,
     exact: true
   },
   {
     element: SurveyTeamDetail,
     path: `survey-teams/:id`,
     exact: true
   },
   {
     element: InstallationWorkflow,
     path: `installation-workflow`, // For demo purposes, normally linked to plant ID
     exact: true
   },
   {
     element: HandoffReview,
     path: `handoff/review`,
     exact: true
   },
   {
     element: CommissioningHandoff,
     path: `commissioning/handoff`,
     exact: true
   },
   {
     element: AuditTrail,
     path: `audit-trail`,
     exact: true
   },
   {
     element: CustomerOnboarding,
     path: `customer/setup`,
     exact: true
   },
   {
     element: CustomerDashboard,
     path: `customer/dashboard`,
     exact: true
   },
   {
     element: SolarRequests,
     path: `admin/leads`,
     exact: true
   },
   {
     element: CustomerList,
     path: `customer`,
     exact: true
   },
    {
     element: CreateCustomer,
     path: `customer/create`,
     exact: true
   },
   {
     element: CustomerPayments,
     path: `customer/payments`,
     exact: true
   },
   {
     element: CustomerInvoices,
     path: `customer/invoices`,
     exact: true
   },
   {
     element: CustomerBenefits,
     path: `customer/benefits`,
     exact: true
   },
   {
     element: CustomerCancellation,
     path: `customer/cancellation`,
     exact: true
   },


   

]