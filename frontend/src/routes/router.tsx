import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/app/AppLayout";
import CommonLayout from "@/layouts/common/CommonLayout";

import HomePage from "@/pages/app/home/HomePage";
import NotFoundPage from "@/pages/errors/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <CommonLayout />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
