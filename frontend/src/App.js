import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Banner from "./components/Banner";
import RecoverPassword from "./pages/RecoverPassword";

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
            <Route path="/recover-password" element={<RecoverPassword />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
