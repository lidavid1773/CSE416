import { Link } from "react-router-dom";
import { SignInIcon, SignOutIcon, UserIcon, ProfileIcon } from "../assets";
import { useSelector, useDispatch } from "react-redux";
import { logout, resetState } from "../features/users/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Banner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const [searchText, setSearchText] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetState());
  };

  const searchOnSubmit = (e) => {
    e.preventDefault();
    setSearchText("");
    if (searchText.trim() != "") navigate(`/search/${searchText}`);
  };

  return (
    <header className="banner">
      <div className="app-title">
        <Link to="/" className="mapworkshop">
          MapWorkshop
        </Link>
      </div>

      <form onSubmit={searchOnSubmit}>
        <input
          className="search-bar"
          value={searchText}
          type="text"
          placeholder="Search maps..."
          onChange={(e) => setSearchText(e.target.value)}
        />
      </form>

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
