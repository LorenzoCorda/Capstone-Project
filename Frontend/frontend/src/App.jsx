import { BrowserRouter, Routes, Route } from "react-router-dom";
import GuestHomePage from "../pages/GuestHomePage";
import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import NewPost from "../pages/dashboard/NewPost";
import MyPosts from "../pages/dashboard/MyPosts";
import Participations from "../pages/dashboard/Participations";
import Profile from "../pages/dashboard/Profile";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import VerifyEmail from "../pages/VerifyEmail";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import AllPosts from "../pages/dashboard/AllPosts";
import AllDancers from "../pages/dashboard/AllDancers";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GuestHomePage />} />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="new-post" element={<NewPost />} />
            <Route path="my-posts" element={<MyPosts />} />
            <Route path="training" element={<AllPosts />} />
            <Route path="dancers" element={<AllDancers />} />

            <Route path="participations" element={<Participations />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
