import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div>
      <div>MapWorkshop</div>
      <div>
        <Link to="/login">
          <button>Log in</button>
        </Link>
        <Link to="/register">
          <button>Sign Up</button>
        </Link>
      </div>
      <div>
        <Link to="/home" state={{ isGuest: true }}>
          Continue as guest
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
