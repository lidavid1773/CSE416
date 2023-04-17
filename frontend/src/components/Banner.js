import { Link, useNavigate } from "react-router-dom";
import { SignInIcon, SignOutIcon, UserIcon } from "../assets";
import { useSelector, useDispatch } from "react-redux";
import { logout, resetState } from "../features/users/userSlice";

function Banner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetState());
    navigate("/");
  };

  return (
    <header className="banner">
      <div>
        <Link to="/" className="mapworkshop">
          MapWorkshop
        </Link>
      </div>

      <ul>
        {user ? (
          <li>
            <button className="btn" onClick={handleLogout}>
              <SignOutIcon /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">
                <SignInIcon /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <UserIcon /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Banner;
