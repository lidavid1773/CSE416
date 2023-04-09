import "./index.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
