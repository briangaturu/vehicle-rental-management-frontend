import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../src/pages/Home";
import "./App.css";
import About from "./pages/About";
import Explore from "./pages/Explore";
import ContactPage from "./pages/Contact";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ErrorPage from "./pages/Error";
import ProtectedRoute from "./components/ProtectedRoutes";
import Payments from "./content/UserDashboard/Payments";
import UserTicketsPage from "./content/UserDashboard/Tickets";
import UserLayout from "./dashboardDesign/userLayout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/explore",
      element: <Explore />,
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      )
    },
    {
      path: "/user",
      element: <UserLayout />,
      children: [
        {
          path: "profile",
          element: <UserDashboard />,
        },
        {
          path: "payments",
          element: <Payments />,
        },
        {
          path: "tickets",
          element: <UserTicketsPage />,
        }
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
