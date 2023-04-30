import { Link } from "react-router-dom";
import { SignInIcon, SignOutIcon, UserIcon, ProfileIcon } from "../assets";
import { useSelector, useDispatch } from "react-redux";
import { logout, resetState } from "../features/users/userSlice";

function Banner() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetState());
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
          <>
            <li>
              <Link to={`/profile/${user.username}`}>
                <ProfileIcon /> Profile
              </Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>
                <SignOutIcon /> Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">
                <UserIcon /> Register
              </Link>
            </li>
            <li>
              <Link to="/login">
                <SignInIcon /> Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Banner;
