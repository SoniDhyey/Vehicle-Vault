import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Home from "../pages/Home";
import About from "../pages/About";
import Help from "../pages/Help";
import { UserNavbar } from "../components/user/UserNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { CarList } from "../components/user/CarList";
import { CarDetail } from "../components/user/CarDetail";

// Pages
import VehicleDetails from "../pages/buyer/VehicleDetails";
import EditVehicle from "../pages/seller/EditVehicle";
import BuyerDashboard from "../pages/buyer/BuyerDashboard";
import SellerDashboard from "../pages/seller/SellerDashboard";
import AddVehicle from "../pages/seller/AddVehicle";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// Offer Pages
import MyOffer from "../pages/offer/MyOffer"; 
import SellerOffer from "../pages/seller/SellerOffer"; 

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AllUserList from "../pages/admin/AllUserList"; 
import AdminSettings from "../pages/admin/AdminSetting";

// Inspection
import AddReport from "../pages/inspection/AddReport";
import ReportList from "../pages/inspection/ReportList";

// TEST DRIVE IMPORTS
import BookTestDrive from "../pages/testdrive/BookTestDrive";
import MyBookings from "../pages/testdrive/MyBookings";
import TestDriveDetails from "../pages/testdrive/TestDriveDetails";

// INQUIRY IMPORTS
import MyInquiries from "../pages/inquiry/MyInquiries";
import SellerInquiries from "../pages/inquiry/SellerInquiries";
import SendInquiry from "../pages/inquiry/SendInquiry";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/about", element: <About /> },
  { path: "/help", element: <Help /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  // BUYER ROUTES
  {
    path: "/user",
    element: <UserNavbar />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <BuyerDashboard /> },
      { path: "vehicle/:id", element: <VehicleDetails /> },
      { path: "carlist", element: <CarList /> },
      { path: "cardetail", element: <CarDetail /> },
      { path: "my-offer", element: <MyOffer /> },
      
      // ✅ FIXED: These now match the useParams() call in your components
      { path: "book-testdrive/:vehicleId", element: <BookTestDrive /> },
      { path: "send-inquiry/:vehicleId", element: <SendInquiry /> },
      
      { path: "my-bookings", element: <MyBookings /> },
      { path: "my-inquiries", element: <MyInquiries /> },
    ],
  },

  // SELLER ROUTES
  {
    path: "/seller",
    element: <UserNavbar />, 
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <SellerDashboard /> },
      { path: "addvehicle", element: <AddVehicle /> },
      { path: "edit/:id", element: <EditVehicle /> },
      { path: "report/:vehicleId", element: <AddReport /> }, 
      { path: "offers", element: <SellerOffer /> },
      { path: "all-reports", element: <ReportList /> },
      { path: "test-drives", element: <TestDriveDetails /> }, 
      { path: "testdrive/:id", element: <TestDriveDetails /> },
      { path: "inquiries", element: <SellerInquiries /> },
    ],
  },

  // ADMIN ROUTES
  {
    path: "/admin",
    element: <AdminSidebar />, 
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "allusers", element: <AllUserList /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "testdrive/:id", element: <TestDriveDetails /> },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;