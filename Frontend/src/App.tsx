import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import AuthLayout from "./Layout/AuthLayout";
import PublicRoute from "./PublicProtected/PublicRoute";
import ProtectedRoute from "./PublicProtected/ProtectedRoute";
import EmployeeLayout from "./Layout/EmployeeLayout";
import AdminLayout from "./Layout/AdminLayout";
import Home from "./Employee/Home";
import Dashboard from "./Admin/Dashboard";
import AdminCalendar from "./Admin/AdminCalendar";
import AdminRooms from "./Admin/Rooms/AdminRooms";
import AdminEquipment from "./Admin/Equipments/AdminEquipment";
import BookingDetails from "./Employee/BookingDetails";
import RoomDetails from "./Employee/RoomDetails";
import Rooms from "./Employee/Rooms";
import MyBookings from "./Employee/MyBookings";
import CreateBooking from "./Employee/CreateBooking";
export default function App() {
  return (
    <>
      <Routes>
        <Route
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRole="EMPLOYEE">
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />

          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:roomId" element={<RoomDetails />} />
          <Route path="rooms/:roomId/book" element={<CreateBooking />} />

          <Route path="bookings" element={<MyBookings />} />
          <Route path="bookings/:bookingId" element={<BookingDetails />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="equipment" element={<AdminEquipment />} />
        </Route>
      </Routes>
    </>
  );
}
