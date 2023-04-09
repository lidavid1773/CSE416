import "./index.css";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";
import WelcomePage from "./pages/WelcomePage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="recover-password" element={<RecoverPasswordPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="home" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
