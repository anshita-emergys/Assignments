import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const DoctorTable = lazy(() =>
  import("@src/views/doctor/doctorView/DoctorTable")
);
const AppointmentRequests = lazy(() =>
  import("@views/admin/appointmentRequests/AppointmentRequests")
);
const DoctorDashboard = lazy(() => import("@pages/doctorPage/DoctorDashboard"));
const Login = lazy(() => import("@views/authentication/Login"));
const Signup = lazy(() => import("@views/authentication/Signup"));
const AuthPage = lazy(() => import("@pages/authPage/AuthPage"));
const ForgotPassword = lazy(() =>
  import("@views/Authentication/ForgotPassword")
);
const AdminDashboard = lazy(() => import("@pages/adminPage/AdminDashboard"));
const AdminTable = lazy(() => import("@views/admin/AdminTable"));
const UserDashboard = lazy(() => import("@pages/userPage/UserDashboard"));
const PatientCard = lazy(() =>
  import("@views/patient/patientCard/PatientCard")
);
const UserLanding = lazy(() => import("@views/user/UserLanding"));
const MultiStep = lazy(() => import("@views/patient/multiStep/MultiStep"));
const PatientDetails = lazy(() =>
  import("@views/patient/patientDetails/PatientDetails")
);
const EditProfile = lazy(() => import("@views/user/editProfile/EditProfile"));
const AdminSettings = lazy(() => import("@views/admin/settings/AdminSettings"));
const Appointment = lazy(() =>
  import("@views/patient/appointment/Appointment")
);
const DoctorList = lazy(() => import("@views/admin/doctorList/DoctorList"));

const LoadingFallback = () => {
  return <div> loading..?  <Skeleton count={3} height={100} containerClassName='skeleton' /> </div>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthPage />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="login" /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },

  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "user",
        element: <UserDashboard />,
        children: [
          { index: true, element: <UserLanding /> },
          { path: "patients", element: <PatientCard /> },
          { path: "add-patient", element: <MultiStep /> },
          { path: "patient-details/:id", element: <PatientDetails /> },
          { path: "patients/book-appointment/:id", element: <Appointment /> },
          { path: "edit-profile", element: <EditProfile /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoutes requiredAdmin />,
    children: [
      {
        path: "admin",
        element: <AdminDashboard />,
        children: [
          { index: true, element: <AdminTable /> },
          { path: "patients", element: <PatientCard /> },
          { path: "add-patient", element: <MultiStep /> },
          { path: "patient-details/:id", element: <PatientDetails /> },
          { path: "doctors", element: <DoctorList /> },
          { path: "appointments", element: <AppointmentRequests /> },
          { path: "patients/book-appointment/:id", element: <Appointment /> },
          { path: "settings", element: <AdminSettings /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoutes requiredDoctor />,
    children: [
      {
        path: "doctor",
        element: <DoctorDashboard />,
        children: [
          { index: true, element: <DoctorTable /> },
          { path: "patients", element: <PatientCard /> },
          { path: "add-patient", element: <MultiStep /> },
          { path: "patient-details/:id", element: <PatientDetails /> },
          { path: "edit-profile", element: <EditProfile /> },
        ],
      },
    ],
  },
]);

export default router;
