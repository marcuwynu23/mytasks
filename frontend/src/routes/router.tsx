import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "@/auth/ProtectedRoute";
import AppLayout from "@/layouts/app/AppLayout";
import CommonLayout from "@/layouts/common/CommonLayout";

import LoginPage from "@/pages/auth/login/LoginPage";
import DashboardPage from "@/pages/app/dashboard/DashboardPage";
import TasksPage from "@/pages/app/tasks/TasksPage";
import ProfilePage from "@/pages/app/profile/ProfilePage";
import NotFoundPage from "@/pages/errors/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <CommonLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <AppLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: "tasks", element: <TasksPage /> },
              { path: "profile", element: <ProfilePage /> },
            ],
          },
        ],
      },
      { path: "/login", element: <LoginPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
