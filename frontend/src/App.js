import "./index.css";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";
import WelcomePage from "./pages/WelcomePage";

const App = () => {
  return (
    <div>
      <WelcomePage />
    </div>
  );
};

export default App;
