import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Banner from "./components/Banner";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ViewMapItem from "./components/ViewMapItem";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="container">
          <Banner />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:id/:token"
              element={<ResetPassword />}
            />
            <Route path="/viewmap/:mapId" element={<ViewMapItem />}></Route>
            <Route path="/profile/:username" element={<Profile />}></Route>
            <Route path="/search/:username" element={<Search />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
